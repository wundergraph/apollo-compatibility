import dotenv from 'dotenv';
import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { SchemaLoader } from '@wundergraph/cosmo-to-apollo-schema';

dotenv.config();

// Fetches from cosmo cloud CDN by default
const cosmoSchemaLoader = new SchemaLoader({
  cdn: {
    token: process.env.GRAPH_TOKEN,
  },
  pollInterval: 3000,
});

const gateway = new ApolloGateway({
  supergraphSdl: cosmoSchemaLoader.supergraphSdl,
});

const server = new ApolloServer({
  gateway,
});

startStandaloneServer(server).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
