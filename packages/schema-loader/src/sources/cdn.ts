import { SupergraphSdlHook } from '@apollo/gateway';
import { SupergraphSdlHookOptions } from '@apollo/gateway/dist/config';
import axios, { AxiosError, AxiosInstance } from 'axios';
import axiosRetry, { exponentialDelay, isNetworkError, isRetryableError } from 'axios-retry';
import { createHmac, timingSafeEqual } from 'crypto';
import { CDNOptions } from '../types.js';
import { decodeToken } from '../utils/decode-token.js';
import { parseConfig } from '../utils/parse-config.js';

const getSDL = async (httpClient: AxiosInstance, url: string, config: CDNOptions, latestConfigVersion: string) => {
  try {
    const res = await httpClient.post(
      url,
      {
        version: latestConfigVersion,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.token}`,
        },
      },
    );

    console.log('New config detected');

    if (config.signatureKey) {
      const responseSignature = res.headers['X-Signature-SHA256'];
      if (!responseSignature) {
        throw new Error(
          'Signature header not found in CDN response. Ensure that your Admission Controller was able to sign the config.',
        );
      }

      const dataHmac = createHmac('sha256', config.signatureKey).update(res.data).digest('hex');

      if (!timingSafeEqual(Buffer.from(dataHmac), responseSignature)) {
        throw new Error(
          'Invalid config signature, potential tampering detected. Ensure that your Admission Controller has signed the config correctly.',
        );
      }
    }

    return parseConfig(JSON.stringify(res.data));
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 304) {
        return;
      }

      console.error({ statusCode: error.response?.status, message: error.message }, 'Could not get retrieve sdl');
    } else {
      console.error(error);
    }
  }
};

export const pollCDN = async (
  config: CDNOptions,
  pollInterval: number,
  opts: SupergraphSdlHookOptions,
): ReturnType<SupergraphSdlHook> => {
  const httpClient = axios.create({
    timeout: 10_000,
  });

  axiosRetry(httpClient, {
    retries: 6,
    retryCondition: (err) => isNetworkError(err) || isRetryableError(err),
    retryDelay: (retryCount, error) => {
      return exponentialDelay(retryCount, error, 1000);
    },
    shouldResetTimeout: true,
  });

  const { federatedGraphId, organizationId } = decodeToken(config.token);
  const configURL = `${config.endpoint}/${organizationId}/${federatedGraphId}/routerconfigs/latest.json`;

  let latestConfigVersion = '';

  const t = setInterval(async () => {
    const result = await getSDL(httpClient, configURL, config, latestConfigVersion);

    if (!result) {
      return;
    }

    latestConfigVersion = result.configVersion;
    await opts.healthCheck(result.supergraphSdl);
    opts.update(result.supergraphSdl);
  }, pollInterval);

  const result = await getSDL(httpClient, configURL, config, latestConfigVersion);

  if (!result) {
    process.exit(0);
  }

  latestConfigVersion = result.configVersion;

  return {
    supergraphSdl: result.supergraphSdl,
    async cleanup() {
      clearInterval(t);
    },
  };
};
