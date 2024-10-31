import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { SchemaLoader } from '@wundergraph/cosmo-to-apollo-schema';
import dotenv from 'dotenv';
import { cosmoReportPlugin, CosmoClient } from '@wundergraph/apollo-to-cosmo-metrics';

dotenv.config();

const cosmoSchemaLoader = new SchemaLoader({
  filePath: process.env.EXECUTION_CONFIG_PATH,
  pollInterval: 3000,
});

const gateway = new ApolloGateway({
  supergraphSdl: cosmoSchemaLoader.supergraphSdl,
});
// Plugin definition
const plugin = cosmoReportPlugin(
    new CosmoClient({
      endpointUrl: 'https://cosmo-metrics.wundergraph.com',
      routerToken: process.env.GRAPH_TOKEN,
    }),
  );

const server = new ApolloServer({
  gateway,
  plugins: [plugin],
});

startStandaloneServer(server).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
}).catch((err) => {
  console.error(err);
});
