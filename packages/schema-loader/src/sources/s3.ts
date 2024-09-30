import { SupergraphSdlHook } from '@apollo/gateway';
import { SupergraphSdlHookOptions } from '@apollo/gateway/dist/config';
import * as Minio from 'minio';
import { S3Options } from '../types.js';
import { parseConfig } from '../utils/parse-config.js';
import internal from 'stream';

function streamToString(stream: internal.Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

export const pollS3 = async (
  s3Config: S3Options,
  pollInterval: number,
  opts: SupergraphSdlHookOptions,
): ReturnType<SupergraphSdlHook> => {
  const client = new Minio.Client({
    endPoint: s3Config.endpoint,
    port: s3Config.port,
    useSSL: s3Config.secure || false,
    accessKey: s3Config.accessKey,
    secretKey: s3Config.secretKey,
    region: s3Config.region,
  });

  let lastModifiedTimestamp = 0;

  const t = setInterval(async () => {
    const stat = await client.statObject(s3Config.bucketName, s3Config.objectPath);
    if (stat.lastModified.getTime() === lastModifiedTimestamp) {
      return;
    }

    const objectStream = await client.getObject(s3Config.bucketName, s3Config.objectPath);
    const configContent = await streamToString(objectStream);

    const parsed = parseConfig(configContent);
    if (!parsed) {
      return;
    }

    console.log('New config detected');
    lastModifiedTimestamp = stat.lastModified.getTime();
    await opts.healthCheck(parsed.supergraphSdl);
    opts.update(parsed.supergraphSdl);
  }, pollInterval);

  const stat = await client.statObject(s3Config.bucketName, s3Config.objectPath);
  lastModifiedTimestamp = stat.lastModified.getTime();

  const objectStream = await client.getObject(s3Config.bucketName, s3Config.objectPath);
  const configContent = await streamToString(objectStream);

  const parsed = parseConfig(configContent);
  if (!parsed) {
    process.exit(0);
  }

  return {
    supergraphSdl: parsed.supergraphSdl,
    async cleanup() {
      clearInterval(t);
    },
  };
};
