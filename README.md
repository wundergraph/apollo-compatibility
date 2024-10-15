# Cosmo Apollo Compatibility

This repository provides a collection of useful plugins and packages to help facilitate migration from Apollo to [Cosmo](https://github.com/wundergraph/cosmo).

##  Packages

### 1. [Cosmo to Apollo Schema Loader](/packages/cosmo-to-apollo-schema)
 
An Apollo Gateway plugin/helper that helps you to import your subgraphs directly from your Cosmo execution config and compose it into a supergraph sdl.

#### Cosmo cloud usage
1. Install the cli and login to your organization
```bash
npm i -g wgc
wgc auth login
```

2. Generate a token for your graph
```bash
wgc router token create your_graph_name
```

2. Install and configure the schema loader for your apollo gateway

```bash
npm i @wundergraph/cosmo-to-apollo-schema
```

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

## License

Cosmo is distributed under the [Apache License, Version 2.0](./LICENSE).
