# Cosmo Apollo Compatibility

This repository contains a set of plugins and packages designed to streamline the migration from Apollo to [Cosmo](https://github.com/wundergraph/cosmo).

## Packages

### 1. Schema Loader

The **Schema Loader** is an Apollo Gateway plugin that enables seamless integration of your subgraphs from Cosmo's execution configuration. It helps compose the subgraphs into a Supergraph SDL, simplifying the transition to Cosmo.

#### Usage with Cosmo Cloud

Before using the example below, ensure you have created an API token for your federated graph on Cosmo. You can generate this token by running the following [**wgc**](https://cosmo-docs.wundergraph.com/cli/intro) command:

```bash
wgc router token create
```

Once you have the token, you can use it in your environment file (`.env`) as shown in the [full example](/packages/schema-loader). The following code snippet demonstrates how easy it is to integrate the Schema Loader into your Apollo Gateway setup:

```ts
import dotenv from 'dotenv';
import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { SchemaLoader } from '@wundergraph/cosmo-to-apollo-schema';

dotenv.config();

// Fetches from Cosmo Cloud CDN by default
const cosmoSchemaLoader = new SchemaLoader({
  cdn: {
    // Token for your federated graph on cosmo. 
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

```

### Our partners ❤️
<p align="center">
<a href="https://drizzle.team" target="_blank">
<img src='/assets/soundcloud.jpg'>
</a>
</p>

## License

This project is licensed under the [Apache License, Version 2.0](./LICENSE).