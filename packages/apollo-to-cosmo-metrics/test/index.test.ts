import { describe, expect, afterEach, it, vi, beforeEach } from 'vitest';
import { isMatch } from 'lodash-es';
import { ApolloServer, type ApolloServerPlugin } from '@apollo/server';
import Queue from '@esm2cjs/yocto-queue';
import { Context, cosmoReportPlugin, CosmoClient } from '../src/index.js';
import {
  ArgumentUsageInfo,
  InputUsageInfo,
  SchemaUsageInfoAggregation,
  TypeFieldUsageInfo,
} from '../src/generated/graphqlmetrics/v1/graphqlmetrics_pb.js';

// Simple schema def that covers test needs
const typeDefs = `#graphql
  type Query {
    me: User
    authorisedUsers: [User]
  }
  type Mutation {
    addUserToSystem(input: AddUserInput!): User
  }

  type User {
    urn: ID!
    age: Int
    username: String
    tracks(first: Int): [Track]!
  }
  
  type Track {
    title: String
  }

  input AddUserInput {
    age: Int
    username: String
  }
`;

const resolvers = {
  Query: {
    async me() {
      return { username: 'myusername' };
    },

    async authorisedUsers() {
      return [{ tracks: [{ title: 'title1' }, { title: 'title2' }] }];
    },
  },
  Mutation: {
    async addUserToSystem(_: any, args: any) {
      const { age } = args.input; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      const { username } = args.input; // eslint-disable-line @typescript-eslint/no-unsafe-assignment

      return {
        age: age as number,
        username: username as string,
      };
    },
  },
};

describe('Cosmo report plugin: metrics collector (fields, arguments, inputs', () => {
  let testServer: ApolloServer<Context>;
  let cosmoClient: CosmoClient;
  let plugin: ApolloServerPlugin<Context>;

  beforeEach(async () => {
    vi.useFakeTimers();
    cosmoClient = new CosmoClient({
      endpointUrl: 'https://cosmo-metrics.wundergraph.com',
      routerToken: 'secret',
    });
    plugin = cosmoReportPlugin(cosmoClient, 2000);
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers,
      plugins: [plugin],
    });
  });

  afterEach(async () => {
    await testServer.stop(); // Stops interval
  });

  it('should collect metrics about simple query without input or arguments', async () => {
    const reportMetricsSpy = vi.spyOn(CosmoClient.prototype, 'reportMetrics').mockResolvedValueOnce();

    const enqueueSpy = vi.spyOn(Queue.prototype, 'enqueue');
    const response = await testServer.executeOperation({
      query: 'query Me { me { username } }',
    });

    const metrics: SchemaUsageInfoAggregation | undefined = enqueueSpy.mock.calls[0]?.[0]; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    expect(metrics).toBeDefined();

    // Expected field metrics
    const me = new TypeFieldUsageInfo({
      Path: ['me'],
      TypeNames: ['Query'],
      NamedType: 'User',
      Count: BigInt(1),
    });

    const username = new TypeFieldUsageInfo({
      Path: ['me', 'username'],
      TypeNames: ['User'],
      NamedType: 'String',
      Count: BigInt(1),
    });

    expect(fieldInArray(me, metrics!.SchemaUsage!.TypeFieldMetrics)).toBeTruthy();
    expect(fieldInArray(username, metrics!.SchemaUsage!.TypeFieldMetrics)).toBeTruthy();

    // No args or inputs
    expect(metrics!.SchemaUsage!.ArgumentMetrics.length).toEqual(0);
    expect(metrics!.SchemaUsage!.InputMetrics.length).toEqual(0);

    // Verify that query has not failed
    expect(response.body.kind).toBe('single');

    // @ts-ignore
    expect(response.body.singleResult.data?.me).toEqual({
      username: 'myusername',
    });

    vi.advanceTimersByTime(3000);
    expect(reportMetricsSpy).toHaveBeenCalledTimes(1);

    enqueueSpy.mockRestore();
    reportMetricsSpy.mockRestore();
  });

  it('should collect metrics about mutation with input parameters', async () => {
    const reportMetricsSpy = vi.spyOn(CosmoClient.prototype, 'reportMetrics').mockResolvedValueOnce();

    const enqueueSpy = vi.spyOn(Queue.prototype, 'enqueue');
    const response = await testServer.executeOperation({
      query: 'mutation AddUser($input: AddUserInput!) { addUserToSystem(input: $input) {... on User { age } } }',
      variables: { input: { age: 123, username: 'username123' } },
    });

    const schemaUsageMessage: SchemaUsageInfoAggregation | undefined = enqueueSpy.mock.calls[0]?.[0]; // eslint-disable-line @typescript-eslint/no-unsafe-assignment

    expect(schemaUsageMessage).toBeDefined();
    expect(schemaUsageMessage!.SchemaUsage?.TypeFieldMetrics.length).toBe(2);
    expect(schemaUsageMessage!.SchemaUsage?.InputMetrics.length).toBe(2);
    expect(schemaUsageMessage!.SchemaUsage?.ArgumentMetrics.length).toBe(1);

    const addUserToSystem = new TypeFieldUsageInfo({
      Path: ['addUserToSystem'],
      TypeNames: ['Mutation'],
      NamedType: 'User',
      Count: BigInt(1),
    });

    const age = new TypeFieldUsageInfo({
      Path: ['addUserToSystem', 'age'],
      TypeNames: ['User'],
      NamedType: 'Int',
      Count: BigInt(1),
    });

    expect(fieldInArray(addUserToSystem, schemaUsageMessage!.SchemaUsage!.TypeFieldMetrics)).toBeTruthy();
    expect(fieldInArray(age, schemaUsageMessage!.SchemaUsage!.TypeFieldMetrics)).toBeTruthy();

    const inputArgument = new ArgumentUsageInfo({
      Path: ['addUserToSystem', 'input'],
      TypeName: 'Mutation',
      NamedType: 'AddUserInput',
      Count: BigInt(1),
    });

    expect(argInArray(inputArgument, schemaUsageMessage!.SchemaUsage!.ArgumentMetrics)).toBeTruthy();

    const ageInput = new InputUsageInfo({
      Path: ['AddUserInput', 'age'],
      TypeName: 'AddUserInput',
      NamedType: 'Int',
    });

    const usernameInput = new InputUsageInfo({
      Path: ['AddUserInput', 'username'],
      TypeName: 'AddUserInput',
      NamedType: 'String',
    });

    expect(inputInArray(ageInput, schemaUsageMessage!.SchemaUsage!.InputMetrics)).toBeTruthy();
    expect(inputInArray(usernameInput, schemaUsageMessage!.SchemaUsage!.InputMetrics)).toBeTruthy();

    // Verify that query has not failed
    expect(response.body.kind).toBe('single');

    // @ts-ignore
    expect(response.body.singleResult.data?.addUserToSystem).toEqual({
      age: 123,
    });

    vi.advanceTimersByTime(3000);
    expect(reportMetricsSpy).toHaveBeenCalledTimes(1);

    enqueueSpy.mockRestore();
    reportMetricsSpy.mockRestore();
  });

  it('should collect metrics about query with inline input and arguments,', async () => {
    const reportMetricsSpy = vi.spyOn(CosmoClient.prototype, 'reportMetrics').mockResolvedValueOnce();

    const enqueueSpy = vi.spyOn(Queue.prototype, 'enqueue');

    const response = await testServer.executeOperation({
      query: 'query MyUsers { authorisedUsers { tracks (first: 10 ) { title } } }',
    });

    const schemaUsageMessage: SchemaUsageInfoAggregation | undefined = enqueueSpy.mock.calls[0]?.[0]; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    expect(schemaUsageMessage).toBeDefined();

    const authorisedUsers = new TypeFieldUsageInfo({
      Path: ['authorisedUsers'],
      TypeNames: ['Query'],
      NamedType: 'User',
      Count: BigInt(1),
    });

    const track = new TypeFieldUsageInfo({
      Path: ['authorisedUsers', 'tracks'],
      TypeNames: ['User'],
      NamedType: 'Track',
      Count: BigInt(1),
    });

    const title = new TypeFieldUsageInfo({
      Path: ['authorisedUsers', 'tracks', 'title'],
      TypeNames: ['Track'],
      NamedType: 'String',
      Count: BigInt(1),
    });

    expect(fieldInArray(authorisedUsers, schemaUsageMessage!.SchemaUsage!.TypeFieldMetrics)).toBeTruthy();
    expect(fieldInArray(track, schemaUsageMessage!.SchemaUsage!.TypeFieldMetrics)).toBeTruthy();
    expect(fieldInArray(title, schemaUsageMessage!.SchemaUsage!.TypeFieldMetrics)).toBeTruthy();

    const firstArgument = new ArgumentUsageInfo({
      Path: ['authorisedUsers', 'tracks'],
      TypeName: 'User',
      NamedType: 'Int',
      Count: BigInt(1),
    });

    expect(argInArray(firstArgument, schemaUsageMessage!.SchemaUsage!.ArgumentMetrics)).toBeTruthy();

    const firstInput = new InputUsageInfo({
      Path: ['tracks', 'first'],
      NamedType: 'Int',
      Count: BigInt(1),
    });

    expect(inputInArray(firstInput, schemaUsageMessage!.SchemaUsage!.InputMetrics)).toBeTruthy();

    // Verify that query has not failed
    expect(response.body.kind).toBe('single');

    // @ts-ignore
    expect(response.body.singleResult.data?.authorisedUsers).toEqual([
      {
        tracks: [{ title: 'title1' }, { title: 'title2' }],
      },
    ]);

    vi.advanceTimersByTime(3000);
    expect(reportMetricsSpy).toHaveBeenCalledTimes(1);

    enqueueSpy.mockRestore();
    reportMetricsSpy.mockRestore();
  });

  it('should sent aggregate message to cosmo with multiple schema usage reports', async () => {
    const reportMetricsSpy = vi.spyOn(CosmoClient.prototype, 'reportMetrics').mockResolvedValue();
    await testServer.executeOperation({
      query: 'query Me { me { username } }',
    });

    await testServer.executeOperation({
      query: 'mutation AddUser($input: AddUserInput!) { addUserToSystem(input: $input) {... on User { age } } }',
      variables: { input: { age: 123, username: 'username123' } },
    });
    await testServer.executeOperation({
      query: 'query MyUsers { authorisedUsers { tracks (first: 10 ) { title } } }',
    });
    vi.advanceTimersByTime(3000);
    expect(reportMetricsSpy).toHaveBeenCalledTimes(1);

    expect(reportMetricsSpy).toHaveBeenCalledWith(
      expect.arrayContaining([expect.anything(), expect.anything(), expect.anything()]),
    );
  });
});

function fieldInArray(expectedField: Partial<TypeFieldUsageInfo>, recieved: TypeFieldUsageInfo[]): boolean {
  return recieved.some((field) => isMatch(field, expectedField));
}

function argInArray(expectedArg: Partial<ArgumentUsageInfo>, recieved: ArgumentUsageInfo[]): boolean {
  return recieved.some((arg) => isMatch(arg, expectedArg));
}

function inputInArray(expectedInput: Partial<InputUsageInfo>, recieved: InputUsageInfo[]): boolean {
  return recieved.some((input) => isMatch(input, expectedInput));
}

describe('Cosmo report plugin: reporting mechanisms', () => {
  const maxQueueSize = 100;
  let testServer: ApolloServer<Context>;
  let cosmoClient: CosmoClient;
  let plugin: ApolloServerPlugin<Context>;

  beforeEach(async () => {
    vi.useFakeTimers();
    cosmoClient = new CosmoClient({
      endpointUrl: 'https://cosmo-metrics.wundergraph.com',
      routerToken: 'secret',
    });
    plugin = cosmoReportPlugin(cosmoClient, 10000, maxQueueSize);
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers,
      plugins: [plugin],
    });
  });

  afterEach(async () => {
    await testServer.stop(); // Stops interval
  });

  it('should execute 100 operations and ensure report is called just once', async () => {
    const reportMetricsSpy = vi.spyOn(CosmoClient.prototype, 'reportMetrics').mockResolvedValue();
    const enqueueSpy = vi.spyOn(Queue.prototype, 'enqueue');

    const promises: Promise<any>[] = [];
    for (let i = 0; i < 50; i++) {
      promises.push(
        testServer.executeOperation({
          query: 'query Me { me { username } }',
        }),
      );
    }
    await Promise.allSettled(promises);

    vi.advanceTimersByTime(10000);

    expect(enqueueSpy).toHaveBeenCalledTimes(50);
    expect(reportMetricsSpy).toHaveBeenCalledTimes(1);

    enqueueSpy.mockRestore();
    reportMetricsSpy.mockRestore();
  });

  it('should send report when the queue is full', async () => {
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers,
      plugins: [plugin],
    });

    const reportMetricsSpy = vi.spyOn(CosmoClient.prototype, 'reportMetrics').mockResolvedValue();
    const enqueueSpy = vi.spyOn(Queue.prototype, 'enqueue');

    const promises: Promise<any>[] = [];
    for (let i = 0; i < 200; i++) {
      promises.push(
        testServer.executeOperation({
          query: 'query Me { me { username } }',
        }),
      );
    }
    await Promise.allSettled(promises);

    vi.advanceTimersByTime(3000);
    expect(reportMetricsSpy).toHaveBeenCalledTimes(2);

    enqueueSpy.mockRestore();
    reportMetricsSpy.mockRestore();
  });
});
