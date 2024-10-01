import { SupergraphSdlHook } from '@apollo/gateway';
import { SupergraphSdlHookOptions } from '@apollo/gateway/dist/config';
import { watch } from 'fs';
import { readFile } from 'fs/promises';
import { resolve } from 'pathe';
import { parseConfig } from '../utils/parse-config.js';

export const watchConfigFile = async (path: string, opts: SupergraphSdlHookOptions): ReturnType<SupergraphSdlHook> => {
  const configFilePath = resolve(path);
  const watcher = watch(configFilePath);

  watcher.on('change', async () => {
    try {
      console.log('Config file change detected');
      const config = await readFile(configFilePath, 'utf-8');
      const parsed = parseConfig(config);

      if (!parsed) {
        return;
      }

      await opts.healthCheck(parsed.supergraphSdl);
      opts.update(parsed.supergraphSdl);
    } catch (e) {
      console.error(e);
    }
  });

  const config = await readFile(configFilePath, 'utf-8');
  const parsed = parseConfig(config);

  if (!parsed) {
    throw new Error('Failed to parse config');
  }

  return {
    supergraphSdl: parsed.supergraphSdl,
    async cleanup() {
      watcher.close();
    },
  };
};
