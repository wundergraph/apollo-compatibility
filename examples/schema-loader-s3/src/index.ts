import dotenv from 'dotenv';
import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { SchemaLoader } from '@wundergraph/cosmo-to-apollo-schema';

dotenv.config();

const cosmoSchemaLoader = new SchemaLoader({
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    port: Number(process.env.S3_PORT),
    region: process.env.S3_REGION,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
    objectPath: process.env.S3_OBJECT_PATH,
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
