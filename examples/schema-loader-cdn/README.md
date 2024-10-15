# Schema Loader CDN

This example uses Cosmo Cloud as the CDN provider.

Configuration :

```ts
import { SchemaLoader } from '@wundergraph/cosmo-to-apollo-schema';

// Fetches from cosmo cloud CDN by default unless specified
const cosmoSchemaLoader = new SchemaLoader({
  cdn: {
    token: process.env.GRAPH_TOKEN,
  },
  pollInterval: 3000,
});
```
