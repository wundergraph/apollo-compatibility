import { SupergraphSdlHook } from '@apollo/gateway';
import { watchConfigFile } from './sources/file.js';
import { SchemaLoaderOptions } from './types.js';
import { pollCDN } from './sources/cdn.js';
import { pollS3 } from './sources/s3.js';

const DEFAULT_POLL_INTERVAL = 15000;
const DEFAULT_CDN_ENDPOINT = 'https://cosmo-cdn.wundergraph.com';

export class SchemaLoader {
  constructor(private options: SchemaLoaderOptions) {
    if (!this.options.pollInterval) {
      this.options.pollInterval = DEFAULT_POLL_INTERVAL;
    }

    if (!this.options.cdn && !this.options.filePath && !this.options.s3) {
      throw new Error('One of cdn, filepath or s3 must be provided.');
    }

    if (this.options.cdn && !this.options.cdn.endpoint) {
      this.options.cdn.endpoint = DEFAULT_CDN_ENDPOINT;
    }
  }

  public supergraphSdl: SupergraphSdlHook = async (opts) => {
    if (this.options.cdn) {
      return pollCDN(this.options.cdn, this.options.pollInterval!, opts);
    } else if (this.options.s3) {
      return pollS3(this.options.s3, this.options.pollInterval!, opts);
    } else if (this.options.filePath) {
      return watchConfigFile(this.options.filePath, opts);
    }

    return {
      supergraphSdl: '',
    };
  };
}
