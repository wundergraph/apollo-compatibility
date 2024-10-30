import {
  type GraphQLRequest,
  type ApolloServerPlugin,
  type GraphQLRequestContextExecutionDidStart,
} from '@apollo/server';
import {
  type ArgumentNode,
  type FieldNode,
  type GraphQLObjectType,
  type InputValueDefinitionNode,
  Kind,
  OperationTypeNode,
  type SelectionSetNode,
  type TypeNode,
  VariableDefinitionNode,
  VariableNode,
} from 'graphql';
import Queue from '@esm2cjs/yocto-queue'; // eslint-disable-line @typescript-eslint/naming-convention
import {
  ArgumentUsageInfo,
  ClientInfo,
  InputUsageInfo,
  OperationInfo,
  OperationType,
  RequestInfo,
  SchemaInfo,
  SchemaUsageInfo,
  SchemaUsageInfoAggregation,
  TypeFieldUsageInfo,
} from '../generated/graphqlmetrics/v1/graphqlmetrics_pb';
import {type CosmoClient} from './cosmo-client';

const CLIENT_NAME_HEADER = 'apollographql-client-name';
const CLIENT_VERSION_HEADER = 'apollographql-client-version';
const INTERVAL_TO_FLASH_IN_MS = 20_000;

let reportQueue: Queue<SchemaUsageInfoAggregation>;

export interface Context {}

export function cosmoReportPlugin(
  client: CosmoClient,
  reportIntervalMs: number = INTERVAL_TO_FLASH_IN_MS,
): ApolloServerPlugin<Context> {
  const cosmoClient = client;
  return {
    async serverWillStart() {
      reportQueue = new Queue();

      const interval = setInterval(
        async () => processReports(cosmoClient),
        reportIntervalMs,
      );

      return {
        async serverWillStop() {
          clearInterval(interval);
          await processReports(cosmoClient);
        },
      };
    },
    async requestDidStart() {
      return {
        async executionDidStart(
          context: GraphQLRequestContextExecutionDidStart<Context>,
        ) {
          // Should we report all operations?
          if (context.operationName === 'IntrospectionQuery') {
            return;
          }

          try {
            const metrics = collectMetrics(
              context,
              context.operation.selectionSet,
            );
            enqueueMetrics(context, metrics);
          } catch (error: unknown) {
            const query = context.source.replaceAll(/(\r\n|\n|\r)/gm, '');
            const {variables} = context.request;
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            console.error(
              {errorMessage, query, variables},
              'Cosmo Usage Report Plugin has failed on query',
            );
          }
        },
      };
    },
  };
}

async function processReports(cosmoClient: CosmoClient) {
  const reports: SchemaUsageInfoAggregation[] = [];
  for (let ii = 0; ii < reportQueue.size; ii++) {
    const dequeuedItem = reportQueue.dequeue();
    if (dequeuedItem) {
      reports.push(dequeuedItem);
    } else {
      break;
    }
  }

  if (reports.length === 0) {
    return;
  }

  await cosmoClient.reportMetrics(reports);
}

function enqueueMetrics(
  context: GraphQLRequestContextExecutionDidStart<Context>,
  metrics: RequestMetrics,
) {
  const operationInfo = new OperationInfo({
    Hash: context.queryHash,
    Name: context.operationName!,
    Type: toCosmoOperationType(context.operation.operation),
  });

  const requestInfo = new RequestInfo({
    StatusCode: 200,
    error: false,
  });

  const reportMessage = new SchemaUsageInfoAggregation({
    SchemaUsage: new SchemaUsageInfo({
      RequestDocument: context.source.replaceAll(/(\r\n|\n|\r)/gm, ''),
      TypeFieldMetrics: metrics.fields,
      ArgumentMetrics: metrics.args,
      InputMetrics: metrics.inputs,
      OperationInfo: operationInfo,
      ClientInfo: getClientInfo(context.request),
      RequestInfo: requestInfo,
      SchemaInfo: new SchemaInfo({Version: 'v1'}),
    }),
    RequestCount: BigInt(1),
  });

  reportQueue.enqueue(reportMessage);
}

function getClientInfo(request: GraphQLRequest): ClientInfo {
  const clientName = request.http?.headers.get(CLIENT_NAME_HEADER);
  const clientVersion = request.http?.headers.get(CLIENT_VERSION_HEADER);

  return new ClientInfo({
    Name: clientName!,
    Version: clientVersion!,
  });
}

function toCosmoOperationType(operation: OperationTypeNode): OperationType {
  switch (operation) {
    case OperationTypeNode.QUERY: {
      return OperationType.QUERY;
    }

    case OperationTypeNode.MUTATION: {
      return OperationType.MUTATION;
    }

    case OperationTypeNode.SUBSCRIPTION: {
      return OperationType.SUBSCRIPTION;
    }
  }
}

function collectMetrics(
  context: GraphQLRequestContextExecutionDidStart<Context>,
  selectionSet: SelectionSetNode | undefined,
  path: string[] = [],
  objectType: GraphQLObjectType | undefined = undefined,
): RequestMetrics {
  const metrics = new RequestMetrics();
  if (!selectionSet) return metrics;

  for (const selection of selectionSet.selections) {
    if (
      selection.kind === Kind.FIELD &&
      selection.name.value !== '__typename'
    ) {
      const updatedPath = [...path, selection.name.value];
      let namedType: string;
      let typeName: string;

      if (objectType) {
        const fieldDef = objectType.astNode!.fields!.find(
          (f) => f.name.value === selection.name.value,
        )!;
        namedType = inferNamedType(fieldDef.type);
        typeName = objectType.name;
      } else {
        const {operation} = context.operation;
        const rootFieldDef =
          operation === OperationTypeNode.QUERY
            ? context.schema.getQueryType()?.getFields()[selection.name.value]
            : context.schema.getMutationType()?.getFields()[
                selection.name.value
              ];

        if (!rootFieldDef) return metrics;
        namedType = inferNamedType(rootFieldDef.astNode!.type);
        typeName = capitalize(context.operation.operation.toString());
      }

      metrics.fields.push(
        new TypeFieldUsageInfo({
          Path: updatedPath,
          TypeNames: [typeName],
          NamedType: namedType,
          Count: BigInt(1),
        }),
      );

      if (selection.arguments?.length) {
        metrics.append(
          collectArguments(context, updatedPath, selection, typeName),
        );
      }

      metrics.append(
        collectMetrics(
          context,
          selection.selectionSet,
          updatedPath,
          context.schema.getType(namedType) as GraphQLObjectType,
        ),
      );
    } else if (
      selection.kind === Kind.INLINE_FRAGMENT &&
      selection.typeCondition
    ) {
      const namedType = selection.typeCondition.name.value;
      metrics.append(
        collectMetrics(
          context,
          selection.selectionSet,
          path,
          context.schema.getType(namedType) as GraphQLObjectType,
        ),
      );
    }
  }

  return metrics;
}

function collectArguments(
  context: GraphQLRequestContextExecutionDidStart<Context>,
  path: readonly string[],
  fieldNode: FieldNode,
  typeName: string,
): RequestMetrics {
  const metrics = new RequestMetrics();
  if (!fieldNode.arguments) return metrics;

  const typenameObject = context.schema.getType(typeName) as GraphQLObjectType;
  const fieldName = path.at(-1);
  const fieldDef = typenameObject.astNode!.fields!.find(
    (f) => f.name.value === fieldName,
  )!;

  for (const argument of fieldNode.arguments) {
    const argDef = fieldDef.arguments!.find(
      (arg) => arg.name.value === argument.name.value,
    );

    if (argDef) {
      metrics.args.push(
        new ArgumentUsageInfo({
          Path: [...path, argument.name.value],
          TypeName: typeName,
          NamedType: inferNamedType(argDef.type),
          Count: BigInt(1),
        }),
      );
      metrics.inputs.push(...collectInputs(argument, argDef, path, context));
    }
  }

  return metrics;
}

function collectInputs(
  argument: ArgumentNode,
  argumentDef: InputValueDefinitionNode,
  currentPath: readonly string[],
  context: GraphQLRequestContextExecutionDidStart<Context>,
): InputUsageInfo[] {
  const inputMetrics: InputUsageInfo[] = [];
  const inputPath = currentPath.length > 1 ? [currentPath.at(-1)!] : [];

  if (argument.value.kind === Kind.VARIABLE) {
    // Handle variable input
    const variableDef: VariableDefinitionNode =
      context.operation.variableDefinitions!.find(
        (v) =>
          v.variable.name.value === (argument.value as VariableNode).name.value,
      )!;
    const variableNamedType = inferNamedType(variableDef.type);
    const varNamedTypeDef = context.schema.getType(variableNamedType)!;
    // Object input
    if (varNamedTypeDef.astNode?.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION) {
      if (context.request.variables) {
        const varObjFields = varNamedTypeDef.astNode.fields!;
        for (const varField of varObjFields) {
          inputMetrics.push(
            new InputUsageInfo({
              Path: [variableNamedType, varField.name.value],
              TypeName: variableNamedType,
              NamedType: inferNamedType(varField.type),
            }),
          );
        }
      }
    } else {
      // Input scalar
      inputMetrics.push(
        new InputUsageInfo({
          Path: [...inputPath, argument.name.value],
          NamedType: variableNamedType,
          Count: BigInt(1),
        }),
      );
    }
  } else {
    // Inline input
    inputMetrics.push(
      new InputUsageInfo({
        Path: [...inputPath, argument.name.value],
        NamedType: inferNamedType(argumentDef.type),
        Count: BigInt(1),
      }),
    );
  }

  return inputMetrics;
}

function inferNamedType(node: TypeNode): string {
  switch (node.kind) {
    case Kind.NON_NULL_TYPE:
    case Kind.LIST_TYPE: {
      return inferNamedType(node.type);
    }

    case Kind.NAMED_TYPE: {
      return node.name.value;
    }
  }
}

function capitalize(word: string): string {
  return word.at(0)!.toUpperCase() + word.slice(1);
}

class RequestMetrics {
  fields: TypeFieldUsageInfo[] = [];
  args: ArgumentUsageInfo[] = [];
  inputs: InputUsageInfo[] = [];

  append(metrics: RequestMetrics) {
    this.fields.push(...metrics.fields);
    this.args.push(...metrics.args);
    this.inputs.push(...metrics.inputs);
  }
}
