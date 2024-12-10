## Apollo To Cosmo Metrics

[![npm version](https://badge.fury.io/js/@wundergraph%2Fapollo-to-cosmo-metrics.svg)](https://badge.fury.io/js/@wundergraph%2Fapollo-to-cosmo-metrics)

Cosmo's schema usage plugin for Apollo Gateway was build for the reason of having ability to report
usage metrics to Wundergraph's cosmo ecosystem that helps to track operation's usage together with underlying types, arguments its inputs that schema can define.

Plugin implements ApolloServerPlugin interface that collects usage during request execution.
Collected metrics are being stored in a local queue and being flushed via rpc to cosmo metrics endpoint once in a while (10-20 seconds, depends on config)

Plugin's implementation is currently missing some functionality, here is the list:

- Deduplication of type usage reports, all type reports coming always with count of 1
- Recursive processing of operation inputs, inputs that come as object variables are being collected max to level of 2. In case where a variable has deeper structure (> 2) the implementation will not process it all
- Enum inputs are not being reported
- Operation errors are not being reported, only successful ones (with code 200)
- Cosmo metrics client implementation uses static proto api definition (taken from [here](https://github.com/wundergraph/cosmo/blob/main/proto/wg/cosmo/graphqlmetrics/v1/graphqlmetrics.proto)), it would be nice to make it dynamic, meaning having ability to pull always a newest proto file and generate new client based on that
- No support for subscritions

However, plugin is stable and is able to report lots of standard schema usage, this version is used is production already, results can be seen in schema usage tab in cosmo studio.

## Example Usage

```ts
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
```
