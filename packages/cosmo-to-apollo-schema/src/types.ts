import { Region } from 'minio';

export interface CDNOptions {
  endpoint?: string;
  token: string;
  signatureKey?: string;
}

export interface S3Options {
  endpoint: string;
  port?: number;
  accessKey: string;
  secretKey: string;
  region?: Region;
  secure?: boolean;
  bucketName: string;
  objectPath: string;
}

export interface SchemaLoaderOptions {
  cdn?: CDNOptions;
  s3?: S3Options;
  filePath?: string;

  /*** Defaults to 15000 (15 seconds) */
  pollInterval?: number;
}
