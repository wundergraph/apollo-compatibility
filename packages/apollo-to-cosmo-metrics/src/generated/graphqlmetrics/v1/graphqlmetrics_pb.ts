// https://protobuf.dev/programming-guides/style/

// @generated by protoc-gen-es v1.10.0 with parameter "target=ts"
// @generated from file wg/cosmo/graphqlmetrics/v1/graphqlmetrics.proto (package wg.cosmo.graphqlmetrics.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
} from '@bufbuild/protobuf';
import { Message, proto3, protoInt64 } from '@bufbuild/protobuf';

/**
 * @generated from enum wg.cosmo.graphqlmetrics.v1.OperationType
 */
export enum OperationType {
  /**
   * @generated from enum value: QUERY = 0;
   */
  QUERY = 0,

  /**
   * @generated from enum value: MUTATION = 1;
   */
  MUTATION = 1,

  /**
   * @generated from enum value: SUBSCRIPTION = 2;
   */
  SUBSCRIPTION = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(OperationType)
proto3.util.setEnumType(OperationType, 'wg.cosmo.graphqlmetrics.v1.OperationType', [
  { no: 0, name: 'QUERY' },
  { no: 1, name: 'MUTATION' },
  { no: 2, name: 'SUBSCRIPTION' },
]);

/**
 * @generated from message wg.cosmo.graphqlmetrics.v1.RequestInfo
 */
export class RequestInfo extends Message<RequestInfo> {
  /**
   * @generated from field: int32 StatusCode = 1;
   */
  StatusCode = 0;

  /**
   * @generated from field: bool error = 2;
   */
  error = false;

  constructor(data?: PartialMessage<RequestInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.RequestInfo';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'StatusCode', kind: 'scalar', T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: 'error', kind: 'scalar', T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RequestInfo {
    return new RequestInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RequestInfo {
    return new RequestInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RequestInfo {
    return new RequestInfo().fromJsonString(jsonString, options);
  }

  static equals(
    a: RequestInfo | PlainMessage<RequestInfo> | undefined,
    b: RequestInfo | PlainMessage<RequestInfo> | undefined,
  ): boolean {
    return proto3.util.equals(RequestInfo, a, b);
  }
}

/**
 * @generated from message wg.cosmo.graphqlmetrics.v1.SchemaUsageInfo
 */
export class SchemaUsageInfo extends Message<SchemaUsageInfo> {
  /**
   * RequestDocument is the GraphQL request document
   *
   * @generated from field: string RequestDocument = 1;
   */
  RequestDocument = '';

  /**
   * TypeFieldMetrics is the list of used fields in the request document
   *
   * @generated from field: repeated wg.cosmo.graphqlmetrics.v1.TypeFieldUsageInfo TypeFieldMetrics = 2;
   */
  TypeFieldMetrics: TypeFieldUsageInfo[] = [];

  /**
   * OperationInfo is the operation info
   *
   * @generated from field: wg.cosmo.graphqlmetrics.v1.OperationInfo OperationInfo = 3;
   */
  OperationInfo?: OperationInfo;

  /**
   * SchemaInfo is the schema info
   *
   * @generated from field: wg.cosmo.graphqlmetrics.v1.SchemaInfo SchemaInfo = 4;
   */
  SchemaInfo?: SchemaInfo;

  /**
   * ClientInfo is the client info
   *
   * @generated from field: wg.cosmo.graphqlmetrics.v1.ClientInfo ClientInfo = 5;
   */
  ClientInfo?: ClientInfo;

  /**
   * RequestInfo is the request info
   *
   * @generated from field: wg.cosmo.graphqlmetrics.v1.RequestInfo RequestInfo = 6;
   */
  RequestInfo?: RequestInfo;

  /**
   * Attributes is a map of attributes that can be used to filter the metrics
   *
   * @generated from field: map<string, string> Attributes = 7;
   */
  Attributes: { [key: string]: string } = {};

  /**
   * ArgumentMetrics is the list of used arguments in the request document
   *
   * @generated from field: repeated wg.cosmo.graphqlmetrics.v1.ArgumentUsageInfo ArgumentMetrics = 8;
   */
  ArgumentMetrics: ArgumentUsageInfo[] = [];

  /**
   * InputMetrics is the list of used input fields in the request document
   *
   * @generated from field: repeated wg.cosmo.graphqlmetrics.v1.InputUsageInfo InputMetrics = 9;
   */
  InputMetrics: InputUsageInfo[] = [];

  constructor(data?: PartialMessage<SchemaUsageInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.SchemaUsageInfo';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'RequestDocument', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'TypeFieldMetrics', kind: 'message', T: TypeFieldUsageInfo, repeated: true },
    { no: 3, name: 'OperationInfo', kind: 'message', T: OperationInfo },
    { no: 4, name: 'SchemaInfo', kind: 'message', T: SchemaInfo },
    { no: 5, name: 'ClientInfo', kind: 'message', T: ClientInfo },
    { no: 6, name: 'RequestInfo', kind: 'message', T: RequestInfo },
    {
      no: 7,
      name: 'Attributes',
      kind: 'map',
      K: 9 /* ScalarType.STRING */,
      V: { kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    },
    { no: 8, name: 'ArgumentMetrics', kind: 'message', T: ArgumentUsageInfo, repeated: true },
    { no: 9, name: 'InputMetrics', kind: 'message', T: InputUsageInfo, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SchemaUsageInfo {
    return new SchemaUsageInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SchemaUsageInfo {
    return new SchemaUsageInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SchemaUsageInfo {
    return new SchemaUsageInfo().fromJsonString(jsonString, options);
  }

  static equals(
    a: SchemaUsageInfo | PlainMessage<SchemaUsageInfo> | undefined,
    b: SchemaUsageInfo | PlainMessage<SchemaUsageInfo> | undefined,
  ): boolean {
    return proto3.util.equals(SchemaUsageInfo, a, b);
  }
}

/**
 * @generated from message wg.cosmo.graphqlmetrics.v1.SchemaUsageInfoAggregation
 */
export class SchemaUsageInfoAggregation extends Message<SchemaUsageInfoAggregation> {
  /**
   * @generated from field: wg.cosmo.graphqlmetrics.v1.SchemaUsageInfo SchemaUsage = 1;
   */
  SchemaUsage?: SchemaUsageInfo;

  /**
   * @generated from field: uint64 RequestCount = 2;
   */
  RequestCount = protoInt64.zero;

  constructor(data?: PartialMessage<SchemaUsageInfoAggregation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.SchemaUsageInfoAggregation';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'SchemaUsage', kind: 'message', T: SchemaUsageInfo },
    { no: 2, name: 'RequestCount', kind: 'scalar', T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SchemaUsageInfoAggregation {
    return new SchemaUsageInfoAggregation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SchemaUsageInfoAggregation {
    return new SchemaUsageInfoAggregation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SchemaUsageInfoAggregation {
    return new SchemaUsageInfoAggregation().fromJsonString(jsonString, options);
  }

  static equals(
    a: SchemaUsageInfoAggregation | PlainMessage<SchemaUsageInfoAggregation> | undefined,
    b: SchemaUsageInfoAggregation | PlainMessage<SchemaUsageInfoAggregation> | undefined,
  ): boolean {
    return proto3.util.equals(SchemaUsageInfoAggregation, a, b);
  }
}

/**
 * @generated from message wg.cosmo.graphqlmetrics.v1.ClientInfo
 */
export class ClientInfo extends Message<ClientInfo> {
  /**
   * Name is the GraphQL client name obtained from the request header
   *
   * @generated from field: string Name = 1;
   */
  Name = '';

  /**
   * Version is the GraphQL client version obtained from the request header
   *
   * @generated from field: string Version = 2;
   */
  Version = '';

  constructor(data?: PartialMessage<ClientInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.ClientInfo';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'Name', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'Version', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ClientInfo {
    return new ClientInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ClientInfo {
    return new ClientInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ClientInfo {
    return new ClientInfo().fromJsonString(jsonString, options);
  }

  static equals(
    a: ClientInfo | PlainMessage<ClientInfo> | undefined,
    b: ClientInfo | PlainMessage<ClientInfo> | undefined,
  ): boolean {
    return proto3.util.equals(ClientInfo, a, b);
  }
}

/**
 * @generated from message wg.cosmo.graphqlmetrics.v1.OperationInfo
 */
export class OperationInfo extends Message<OperationInfo> {
  /**
   * Hash is the hash of the request document and the operation name
   *
   * @generated from field: string Hash = 1;
   */
  Hash = '';

  /**
   * Name is the operation name
   *
   * @generated from field: string Name = 2;
   */
  Name = '';

  /**
   * Type is the operation type
   *
   * @generated from field: wg.cosmo.graphqlmetrics.v1.OperationType Type = 3;
   */
  Type = OperationType.QUERY;

  constructor(data?: PartialMessage<OperationInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.OperationInfo';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'Hash', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'Name', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'Type', kind: 'enum', T: proto3.getEnumType(OperationType) },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OperationInfo {
    return new OperationInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OperationInfo {
    return new OperationInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OperationInfo {
    return new OperationInfo().fromJsonString(jsonString, options);
  }

  static equals(
    a: OperationInfo | PlainMessage<OperationInfo> | undefined,
    b: OperationInfo | PlainMessage<OperationInfo> | undefined,
  ): boolean {
    return proto3.util.equals(OperationInfo, a, b);
  }
}

/**
 * FederatedGraphID and OrganizationID are transport over JWT
 *
 * @generated from message wg.cosmo.graphqlmetrics.v1.SchemaInfo
 */
export class SchemaInfo extends Message<SchemaInfo> {
  /**
   * Version is the schema version
   *
   * @generated from field: string Version = 3;
   */
  Version = '';

  constructor(data?: PartialMessage<SchemaInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.SchemaInfo';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 3, name: 'Version', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SchemaInfo {
    return new SchemaInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SchemaInfo {
    return new SchemaInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SchemaInfo {
    return new SchemaInfo().fromJsonString(jsonString, options);
  }

  static equals(
    a: SchemaInfo | PlainMessage<SchemaInfo> | undefined,
    b: SchemaInfo | PlainMessage<SchemaInfo> | undefined,
  ): boolean {
    return proto3.util.equals(SchemaInfo, a, b);
  }
}

/**
 * @generated from message wg.cosmo.graphqlmetrics.v1.TypeFieldUsageInfo
 */
export class TypeFieldUsageInfo extends Message<TypeFieldUsageInfo> {
  /**
   * Path is the path to the field in the request document but without the root type query, mutation, or subscription
   *
   * @generated from field: repeated string Path = 1;
   */
  Path: string[] = [];

  /**
   * TypeNames is the list of enclosing type names of the field
   *
   * @generated from field: repeated string TypeNames = 2;
   */
  TypeNames: string[] = [];

  /**
   * SubgraphIDs is the list of datasource IDs (e.g subgraph ID) that the field is used from
   *
   * @generated from field: repeated string SubgraphIDs = 3;
   */
  SubgraphIDs: string[] = [];

  /**
   * Count is the number of times the field is used. Useful for batching at client side.
   *
   * @generated from field: uint64 Count = 4;
   */
  Count = protoInt64.zero;

  /**
   * NamedType is the underlying type of the field
   *
   * @generated from field: string NamedType = 5;
   */
  NamedType = '';

  /**
   * IndirectInterfaceField is true if the field is an interface field that is used through an implementing type
   *
   * @generated from field: bool IndirectInterfaceField = 6;
   */
  IndirectInterfaceField = false;

  constructor(data?: PartialMessage<TypeFieldUsageInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.TypeFieldUsageInfo';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'Path', kind: 'scalar', T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 2, name: 'TypeNames', kind: 'scalar', T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 3, name: 'SubgraphIDs', kind: 'scalar', T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 4, name: 'Count', kind: 'scalar', T: 4 /* ScalarType.UINT64 */ },
    { no: 5, name: 'NamedType', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 6, name: 'IndirectInterfaceField', kind: 'scalar', T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TypeFieldUsageInfo {
    return new TypeFieldUsageInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TypeFieldUsageInfo {
    return new TypeFieldUsageInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TypeFieldUsageInfo {
    return new TypeFieldUsageInfo().fromJsonString(jsonString, options);
  }

  static equals(
    a: TypeFieldUsageInfo | PlainMessage<TypeFieldUsageInfo> | undefined,
    b: TypeFieldUsageInfo | PlainMessage<TypeFieldUsageInfo> | undefined,
  ): boolean {
    return proto3.util.equals(TypeFieldUsageInfo, a, b);
  }
}

/**
 * @generated from message wg.cosmo.graphqlmetrics.v1.ArgumentUsageInfo
 */
export class ArgumentUsageInfo extends Message<ArgumentUsageInfo> {
  /**
   * Path is the path to the field in the request document but without the root type query, mutation, or subscription
   *
   * @generated from field: repeated string Path = 1;
   */
  Path: string[] = [];

  /**
   * TypeName is the enclosing type name of the argument
   *
   * @generated from field: string TypeName = 2;
   */
  TypeName = '';

  /**
   * Count is the number of times the argument is used. Useful for batching at client side.
   *
   * @generated from field: uint64 Count = 3;
   */
  Count = protoInt64.zero;

  /**
   * NamedType is the underlying type of the argument
   *
   * @generated from field: string NamedType = 4;
   */
  NamedType = '';

  constructor(data?: PartialMessage<ArgumentUsageInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.ArgumentUsageInfo';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'Path', kind: 'scalar', T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 2, name: 'TypeName', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'Count', kind: 'scalar', T: 4 /* ScalarType.UINT64 */ },
    { no: 4, name: 'NamedType', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ArgumentUsageInfo {
    return new ArgumentUsageInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ArgumentUsageInfo {
    return new ArgumentUsageInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ArgumentUsageInfo {
    return new ArgumentUsageInfo().fromJsonString(jsonString, options);
  }

  static equals(
    a: ArgumentUsageInfo | PlainMessage<ArgumentUsageInfo> | undefined,
    b: ArgumentUsageInfo | PlainMessage<ArgumentUsageInfo> | undefined,
  ): boolean {
    return proto3.util.equals(ArgumentUsageInfo, a, b);
  }
}

/**
 * @generated from message wg.cosmo.graphqlmetrics.v1.InputUsageInfo
 */
export class InputUsageInfo extends Message<InputUsageInfo> {
  /**
   * Path is the path to the field in the request document but without the root type query, mutation, or subscription
   *
   * @generated from field: repeated string Path = 1;
   */
  Path: string[] = [];

  /**
   * TypeName is the enclosing type name of the argument
   *
   * @generated from field: string TypeName = 2;
   */
  TypeName = '';

  /**
   * Count is the number of times the argument is used. Useful for batching at client side.
   *
   * @generated from field: uint64 Count = 3;
   */
  Count = protoInt64.zero;

  /**
   * NamedType is the underlying type of the input field
   *
   * @generated from field: string NamedType = 4;
   */
  NamedType = '';

  /**
   * EnumValues is an empty list if the input field is not an enum, otherwise it contains the list of used enum values
   *
   * @generated from field: repeated string EnumValues = 5;
   */
  EnumValues: string[] = [];

  constructor(data?: PartialMessage<InputUsageInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.InputUsageInfo';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'Path', kind: 'scalar', T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 2, name: 'TypeName', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'Count', kind: 'scalar', T: 4 /* ScalarType.UINT64 */ },
    { no: 4, name: 'NamedType', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 5, name: 'EnumValues', kind: 'scalar', T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): InputUsageInfo {
    return new InputUsageInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): InputUsageInfo {
    return new InputUsageInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): InputUsageInfo {
    return new InputUsageInfo().fromJsonString(jsonString, options);
  }

  static equals(
    a: InputUsageInfo | PlainMessage<InputUsageInfo> | undefined,
    b: InputUsageInfo | PlainMessage<InputUsageInfo> | undefined,
  ): boolean {
    return proto3.util.equals(InputUsageInfo, a, b);
  }
}

/**
 * @generated from message wg.cosmo.graphqlmetrics.v1.PublishGraphQLRequestMetricsRequest
 */
export class PublishGraphQLRequestMetricsRequest extends Message<PublishGraphQLRequestMetricsRequest> {
  /**
   * @generated from field: repeated wg.cosmo.graphqlmetrics.v1.SchemaUsageInfo SchemaUsage = 1;
   */
  SchemaUsage: SchemaUsageInfo[] = [];

  constructor(data?: PartialMessage<PublishGraphQLRequestMetricsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.PublishGraphQLRequestMetricsRequest';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'SchemaUsage', kind: 'message', T: SchemaUsageInfo, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PublishGraphQLRequestMetricsRequest {
    return new PublishGraphQLRequestMetricsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PublishGraphQLRequestMetricsRequest {
    return new PublishGraphQLRequestMetricsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PublishGraphQLRequestMetricsRequest {
    return new PublishGraphQLRequestMetricsRequest().fromJsonString(jsonString, options);
  }

  static equals(
    a: PublishGraphQLRequestMetricsRequest | PlainMessage<PublishGraphQLRequestMetricsRequest> | undefined,
    b: PublishGraphQLRequestMetricsRequest | PlainMessage<PublishGraphQLRequestMetricsRequest> | undefined,
  ): boolean {
    return proto3.util.equals(PublishGraphQLRequestMetricsRequest, a, b);
  }
}

/**
 * @generated from message wg.cosmo.graphqlmetrics.v1.PublishOperationCoverageReportResponse
 */
export class PublishOperationCoverageReportResponse extends Message<PublishOperationCoverageReportResponse> {
  constructor(data?: PartialMessage<PublishOperationCoverageReportResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.PublishOperationCoverageReportResponse';
  static readonly fields: FieldList = proto3.util.newFieldList(() => []);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PublishOperationCoverageReportResponse {
    return new PublishOperationCoverageReportResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PublishOperationCoverageReportResponse {
    return new PublishOperationCoverageReportResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): PublishOperationCoverageReportResponse {
    return new PublishOperationCoverageReportResponse().fromJsonString(jsonString, options);
  }

  static equals(
    a: PublishOperationCoverageReportResponse | PlainMessage<PublishOperationCoverageReportResponse> | undefined,
    b: PublishOperationCoverageReportResponse | PlainMessage<PublishOperationCoverageReportResponse> | undefined,
  ): boolean {
    return proto3.util.equals(PublishOperationCoverageReportResponse, a, b);
  }
}

/**
 * @generated from message wg.cosmo.graphqlmetrics.v1.PublishAggregatedGraphQLRequestMetricsRequest
 */
export class PublishAggregatedGraphQLRequestMetricsRequest extends Message<PublishAggregatedGraphQLRequestMetricsRequest> {
  /**
   * @generated from field: repeated wg.cosmo.graphqlmetrics.v1.SchemaUsageInfoAggregation Aggregation = 1;
   */
  Aggregation: SchemaUsageInfoAggregation[] = [];

  constructor(data?: PartialMessage<PublishAggregatedGraphQLRequestMetricsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.PublishAggregatedGraphQLRequestMetricsRequest';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'Aggregation', kind: 'message', T: SchemaUsageInfoAggregation, repeated: true },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): PublishAggregatedGraphQLRequestMetricsRequest {
    return new PublishAggregatedGraphQLRequestMetricsRequest().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): PublishAggregatedGraphQLRequestMetricsRequest {
    return new PublishAggregatedGraphQLRequestMetricsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): PublishAggregatedGraphQLRequestMetricsRequest {
    return new PublishAggregatedGraphQLRequestMetricsRequest().fromJsonString(jsonString, options);
  }

  static equals(
    a:
      | PublishAggregatedGraphQLRequestMetricsRequest
      | PlainMessage<PublishAggregatedGraphQLRequestMetricsRequest>
      | undefined,
    b:
      | PublishAggregatedGraphQLRequestMetricsRequest
      | PlainMessage<PublishAggregatedGraphQLRequestMetricsRequest>
      | undefined,
  ): boolean {
    return proto3.util.equals(PublishAggregatedGraphQLRequestMetricsRequest, a, b);
  }
}

/**
 * @generated from message wg.cosmo.graphqlmetrics.v1.PublishAggregatedGraphQLRequestMetricsResponse
 */
export class PublishAggregatedGraphQLRequestMetricsResponse extends Message<PublishAggregatedGraphQLRequestMetricsResponse> {
  constructor(data?: PartialMessage<PublishAggregatedGraphQLRequestMetricsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'wg.cosmo.graphqlmetrics.v1.PublishAggregatedGraphQLRequestMetricsResponse';
  static readonly fields: FieldList = proto3.util.newFieldList(() => []);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): PublishAggregatedGraphQLRequestMetricsResponse {
    return new PublishAggregatedGraphQLRequestMetricsResponse().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): PublishAggregatedGraphQLRequestMetricsResponse {
    return new PublishAggregatedGraphQLRequestMetricsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): PublishAggregatedGraphQLRequestMetricsResponse {
    return new PublishAggregatedGraphQLRequestMetricsResponse().fromJsonString(jsonString, options);
  }

  static equals(
    a:
      | PublishAggregatedGraphQLRequestMetricsResponse
      | PlainMessage<PublishAggregatedGraphQLRequestMetricsResponse>
      | undefined,
    b:
      | PublishAggregatedGraphQLRequestMetricsResponse
      | PlainMessage<PublishAggregatedGraphQLRequestMetricsResponse>
      | undefined,
  ): boolean {
    return proto3.util.equals(PublishAggregatedGraphQLRequestMetricsResponse, a, b);
  }
}
