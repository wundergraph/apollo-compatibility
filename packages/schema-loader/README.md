# Schema Loader

An Apollo Gateway plugin/helper that helps you to import your subgraphs directly from your Cosmo execution config and compose it into a supergraph sdl. It supports multiple import methods, including:

- **Config File Watcher**
- **CDN Polling**
- **S3 Polling**

## Example Usage

```ts
import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// 1. Import Schema Loader
import { SchemaLoader } from '@wundergraph/cosmo-schema-loader';

// 2. Configure with file, cdn or s3
const cosmoSchemaLoader = new SchemaLoader({
  filePath: "./cosmo-config.json",
});

// 3. Pass it to the gateway subgraphSdl
const gateway = new ApolloGateway({
  supergraphSdl: cosmoSchemaLoader.supergraphSdl,
});

const server = new ApolloServer({
  gateway,
});

startStandaloneServer(server)
```

## Loader Options

At least one of CDN, S3 or file path must be provided.

```ts
SchemaLoaderOptions {
  cdn?: CDNOptions;
  s3?: S3Options;
  filePath?: string;

  /*** Defaults to 15000 (15 seconds) */
  pollInterval?: number;
}
```

## File

The plugin watches for any config file changes for the provided path and updates the sdl accordingly.

```ts
filePath: string
```

## CDN

Poll the CDN for config file. The default interval is 15 seconds.

```ts
interface CDNOptions {
  endpoint?: string;
  token: string;
  signatureKey?: string;
}
```

`endpoint`: The url to the cdn. (default https://cosmo-cdn.wundergraph.com). 

`token`: The token for your Federated Graph. You can generate one with the [token create command](https://cosmo-docs.wundergraph.com/cli/router/token/create).

`signatureKey`: The optional signature key is the one used to sign your config in your admission server.

## S3

Poll your S3 bucket for the execution config. The default interval is 15 seconds.

```ts
interface S3Options {
  endpoint: string;
  port?: number;
  accessKey: string;
  secretKey: string;
  region?: Region;
  secure?: boolean;
  bucketName: string;
  objectPath: string;
}
```
