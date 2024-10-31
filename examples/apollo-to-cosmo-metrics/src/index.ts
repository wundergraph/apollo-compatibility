import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { cosmoReportPlugin, CosmoClient } from '@wundergraph/apollo-to-cosmo-metrics';


const gateway = new ApolloGateway({
  supergraphSdl: 'supergraph-url',
});

// Plugin definition
const cosmoReportPlugin = cosmoReportPlugin(
    new CosmoClient({
      endpointUrl: 'https://cosmo-metrics.wundergraph.com',
      routerToken: 'router-token',
    }),
  );

const server = new ApolloServer({
  gateway,
  plugins: [cosmoReportPlugin],
});

startStandaloneServer(server);
