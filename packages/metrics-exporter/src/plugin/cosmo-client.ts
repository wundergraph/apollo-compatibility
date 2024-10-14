import {Client, createClient} from '@connectrpc/connect';
import {createConnectTransport} from '@connectrpc/connect-node';
import {GraphQLMetricsService} from '../generated/graphqlmetrics/v1/graphqlmetrics_connect';
import {type SchemaUsageInfoAggregation} from '../generated/graphqlmetrics/v1/graphqlmetrics_pb';

export type CosmoConfig = {
  routerToken: string;
  endpointUrl: string;
};

export class CosmoClient {
  private readonly client: Client<typeof GraphQLMetricsService>;
  private readonly config;

  constructor(config: CosmoConfig) {
    this.config = config;
    this.client = createClient(
      GraphQLMetricsService,
      createConnectTransport({
        baseUrl: config.endpointUrl,
        httpVersion: '1.1',
      }),
    );
  }

  async reportMetrics(reports: SchemaUsageInfoAggregation[]) {
    const aggregatedReports = {
      Aggregation: [...reports],
    };
    const numberOfReports = reports.length;
    console.log(
      {numberOfReports},
      'Sending to cosmo batch of schema usage reports',
    );
    await this.client.publishAggregatedGraphQLMetrics(aggregatedReports, {
      headers: new Headers([
        ['Authorization', `Bearer ${this.config.routerToken}`],
      ]),
    });
  }
}
