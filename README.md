# Cosmo Apollo Compatibility

This repository contains a set of plugins and packages designed to streamline the migration from Apollo to [Cosmo](https://github.com/wundergraph/cosmo).

### Usage with Cosmo Cloud

Before using the examples below, ensure you have created an API token for your federated graph on Cosmo. You can generate this token by running the following [**wgc**](https://cosmo-docs.wundergraph.com/cli/intro) command:

```bash
wgc router token create
```

## Packages

### 1. Schema Loader

[![npm version](https://badge.fury.io/js/@wundergraph%2Fcosmo-to-apollo-schema.svg?icon=si:npm)](https://badge.fury.io/js/@wundergraph%2Fcosmo-to-apollo-schema)

```bash
npm i @wundergraph/cosmo-to-apollo-schema
```

The **Schema Loader** is an Apollo Gateway plugin that enables seamless integration of your subgraphs from Cosmo's execution configuration. It helps compose the subgraphs into a Supergraph SDL, simplifying the transition to Cosmo.

Once you have the token, you can use it in your environment file (`.env`) as shown in the [full example](/examples/schema-loader-cdn). The following code snippet demonstrates how easy it is to integrate the Schema Loader into your Apollo Gateway setup:

**Example**: [Apollo Gateway with Schema Loader](./examples/schema-loader-cdn)

### 2. Metric Exporter

[![npm version](https://badge.fury.io/js/@wundergraph%2Fapollo-to-cosmo-metrics.svg)](https://badge.fury.io/js/@wundergraph%2Fapollo-to-cosmo-metrics)

```bash
npm i @wundergraph/apollo-to-cosmo-metrics
```

The **Metric Exporter** is a plugin that enables the collection and export of schema usage metrics from Apollo Gateway to Cosmo. It helps you monitor and analyze the usage of your clients and use Cosmo's powerful analytics features like breaking changes detection and schema evolution.

Once you have the token, you can use it in your environment file (`.env`) as shown in the [full example](/packages/apollo-to-cosmo-metrics). The following code snippet demonstrates how easy it is to integrate the metrics exporter into your Apollo Gateway setup:

**Example**: [Apollo Gateway with Metrics Exporter](./examples/apollo-to-cosmo-metrics)

### Our partners ❤️
<p align="center">
<a href="https://github.com/soundcloud" target="_blank">
<img src='/assets/soundcloud.jpg'>
</a>
</p>

## License

This project is licensed under the [Apache License, Version 2.0](./LICENSE).