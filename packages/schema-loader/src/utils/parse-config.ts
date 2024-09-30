import { composeServices } from '@apollo/composition';
import { ServiceDefinition } from '@apollo/gateway';
import { RouterConfig } from '@wundergraph/cosmo-connect/dist/node/v1/node_pb';
import { parse } from 'graphql';
import { injectDirectives } from './inject-directives.js';

/**
 * Extract and compose subgraph schemas
 */
export const parseConfig = (config: string) => {
  const routerConfig = RouterConfig.fromJsonString(config, {
    ignoreUnknownFields: true,
  });

  if (!routerConfig.engineConfig) {
    console.error('Invalid router config. Engine config undefined.');
    return;
  }

  const services: ServiceDefinition[] = [];

  for (const dataSourceConfig of routerConfig.engineConfig.datasourceConfigurations) {
    const subgraph = routerConfig.subgraphs.find((s) => s.id === dataSourceConfig.id);

    if (!subgraph) {
      console.error(`Subgraph with id ${dataSourceConfig.id} not found`);
      return;
    }

    if (!dataSourceConfig.customGraphql?.federation?.serviceSdl) {
      continue;
    }

    const schema = injectDirectives(dataSourceConfig.customGraphql.federation.serviceSdl);

    services.push({
      name: subgraph.name,
      typeDefs: parse(schema),
      url: subgraph.routingUrl,
    });
  }

  const result = composeServices(services);

  if (result.errors) {
    console.error(`Failed to compose`, result.errors);
    return;
  }

  return { supergraphSdl: result.supergraphSdl, configVersion: routerConfig.version };
};
