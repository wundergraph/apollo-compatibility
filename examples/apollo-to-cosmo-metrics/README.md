# Apollo To Cosmo Metrics Example

This example how cosmo report plugin can be used.

```ts
import { cosmoReportPlugin, CosmoClient } from '@wundergraph/apollo-to-cosmo-metrics';

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
```
