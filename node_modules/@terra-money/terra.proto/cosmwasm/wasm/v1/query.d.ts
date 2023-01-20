import Long from "long";
import { grpc } from "@improbable-eng/grpc-web";
import _m0 from "protobufjs/minimal";
import { ContractInfo, AccessConfig, ContractCodeHistoryEntry, Model } from "../../../cosmwasm/wasm/v1/types";
import { PageRequest, PageResponse } from "../../../cosmos/base/query/v1beta1/pagination";
export declare const protobufPackage = "cosmwasm.wasm.v1";
/**
 * QueryContractInfoRequest is the request type for the Query/ContractInfo RPC
 * method
 */
export interface QueryContractInfoRequest {
    /** address is the address of the contract to query */
    address: string;
}
/**
 * QueryContractInfoResponse is the response type for the Query/ContractInfo RPC
 * method
 */
export interface QueryContractInfoResponse {
    /** address is the address of the contract */
    address: string;
    contractInfo?: ContractInfo;
}
/**
 * QueryContractHistoryRequest is the request type for the Query/ContractHistory
 * RPC method
 */
export interface QueryContractHistoryRequest {
    /** address is the address of the contract to query */
    address: string;
    /** pagination defines an optional pagination for the request. */
    pagination?: PageRequest;
}
/**
 * QueryContractHistoryResponse is the response type for the
 * Query/ContractHistory RPC method
 */
export interface QueryContractHistoryResponse {
    entries: ContractCodeHistoryEntry[];
    /** pagination defines the pagination in the response. */
    pagination?: PageResponse;
}
/**
 * QueryContractsByCodeRequest is the request type for the Query/ContractsByCode
 * RPC method
 */
export interface QueryContractsByCodeRequest {
    /** grpc-gateway_out does not support Go style CodID */
    codeId: Long;
    /** pagination defines an optional pagination for the request. */
    pagination?: PageRequest;
}
/**
 * QueryContractsByCodeResponse is the response type for the
 * Query/ContractsByCode RPC method
 */
export interface QueryContractsByCodeResponse {
    /** contracts are a set of contract addresses */
    contracts: string[];
    /** pagination defines the pagination in the response. */
    pagination?: PageResponse;
}
/**
 * QueryAllContractStateRequest is the request type for the
 * Query/AllContractState RPC method
 */
export interface QueryAllContractStateRequest {
    /** address is the address of the contract */
    address: string;
    /** pagination defines an optional pagination for the request. */
    pagination?: PageRequest;
}
/**
 * QueryAllContractStateResponse is the response type for the
 * Query/AllContractState RPC method
 */
export interface QueryAllContractStateResponse {
    models: Model[];
    /** pagination defines the pagination in the response. */
    pagination?: PageResponse;
}
/**
 * QueryRawContractStateRequest is the request type for the
 * Query/RawContractState RPC method
 */
export interface QueryRawContractStateRequest {
    /** address is the address of the contract */
    address: string;
    queryData: Uint8Array;
}
/**
 * QueryRawContractStateResponse is the response type for the
 * Query/RawContractState RPC method
 */
export interface QueryRawContractStateResponse {
    /** Data contains the raw store data */
    data: Uint8Array;
}
/**
 * QuerySmartContractStateRequest is the request type for the
 * Query/SmartContractState RPC method
 */
export interface QuerySmartContractStateRequest {
    /** address is the address of the contract */
    address: string;
    /** QueryData contains the query data passed to the contract */
    queryData: Uint8Array;
}
/**
 * QuerySmartContractStateResponse is the response type for the
 * Query/SmartContractState RPC method
 */
export interface QuerySmartContractStateResponse {
    /** Data contains the json data returned from the smart contract */
    data: Uint8Array;
}
/** QueryCodeRequest is the request type for the Query/Code RPC method */
export interface QueryCodeRequest {
    /** grpc-gateway_out does not support Go style CodID */
    codeId: Long;
}
/** CodeInfoResponse contains code meta data from CodeInfo */
export interface CodeInfoResponse {
    /** id for legacy support */
    codeId: Long;
    creator: string;
    dataHash: Uint8Array;
    instantiatePermission?: AccessConfig;
}
/** QueryCodeResponse is the response type for the Query/Code RPC method */
export interface QueryCodeResponse {
    codeInfo?: CodeInfoResponse;
    data: Uint8Array;
}
/** QueryCodesRequest is the request type for the Query/Codes RPC method */
export interface QueryCodesRequest {
    /** pagination defines an optional pagination for the request. */
    pagination?: PageRequest;
}
/** QueryCodesResponse is the response type for the Query/Codes RPC method */
export interface QueryCodesResponse {
    codeInfos: CodeInfoResponse[];
    /** pagination defines the pagination in the response. */
    pagination?: PageResponse;
}
/**
 * QueryPinnedCodesRequest is the request type for the Query/PinnedCodes
 * RPC method
 */
export interface QueryPinnedCodesRequest {
    /** pagination defines an optional pagination for the request. */
    pagination?: PageRequest;
}
/**
 * QueryPinnedCodesResponse is the response type for the
 * Query/PinnedCodes RPC method
 */
export interface QueryPinnedCodesResponse {
    codeIds: Long[];
    /** pagination defines the pagination in the response. */
    pagination?: PageResponse;
}
export declare const QueryContractInfoRequest: {
    encode(message: QueryContractInfoRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryContractInfoRequest;
    fromJSON(object: any): QueryContractInfoRequest;
    toJSON(message: QueryContractInfoRequest): unknown;
    fromPartial(object: DeepPartial<QueryContractInfoRequest>): QueryContractInfoRequest;
};
export declare const QueryContractInfoResponse: {
    encode(message: QueryContractInfoResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryContractInfoResponse;
    fromJSON(object: any): QueryContractInfoResponse;
    toJSON(message: QueryContractInfoResponse): unknown;
    fromPartial(object: DeepPartial<QueryContractInfoResponse>): QueryContractInfoResponse;
};
export declare const QueryContractHistoryRequest: {
    encode(message: QueryContractHistoryRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryContractHistoryRequest;
    fromJSON(object: any): QueryContractHistoryRequest;
    toJSON(message: QueryContractHistoryRequest): unknown;
    fromPartial(object: DeepPartial<QueryContractHistoryRequest>): QueryContractHistoryRequest;
};
export declare const QueryContractHistoryResponse: {
    encode(message: QueryContractHistoryResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryContractHistoryResponse;
    fromJSON(object: any): QueryContractHistoryResponse;
    toJSON(message: QueryContractHistoryResponse): unknown;
    fromPartial(object: DeepPartial<QueryContractHistoryResponse>): QueryContractHistoryResponse;
};
export declare const QueryContractsByCodeRequest: {
    encode(message: QueryContractsByCodeRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryContractsByCodeRequest;
    fromJSON(object: any): QueryContractsByCodeRequest;
    toJSON(message: QueryContractsByCodeRequest): unknown;
    fromPartial(object: DeepPartial<QueryContractsByCodeRequest>): QueryContractsByCodeRequest;
};
export declare const QueryContractsByCodeResponse: {
    encode(message: QueryContractsByCodeResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryContractsByCodeResponse;
    fromJSON(object: any): QueryContractsByCodeResponse;
    toJSON(message: QueryContractsByCodeResponse): unknown;
    fromPartial(object: DeepPartial<QueryContractsByCodeResponse>): QueryContractsByCodeResponse;
};
export declare const QueryAllContractStateRequest: {
    encode(message: QueryAllContractStateRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryAllContractStateRequest;
    fromJSON(object: any): QueryAllContractStateRequest;
    toJSON(message: QueryAllContractStateRequest): unknown;
    fromPartial(object: DeepPartial<QueryAllContractStateRequest>): QueryAllContractStateRequest;
};
export declare const QueryAllContractStateResponse: {
    encode(message: QueryAllContractStateResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryAllContractStateResponse;
    fromJSON(object: any): QueryAllContractStateResponse;
    toJSON(message: QueryAllContractStateResponse): unknown;
    fromPartial(object: DeepPartial<QueryAllContractStateResponse>): QueryAllContractStateResponse;
};
export declare const QueryRawContractStateRequest: {
    encode(message: QueryRawContractStateRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryRawContractStateRequest;
    fromJSON(object: any): QueryRawContractStateRequest;
    toJSON(message: QueryRawContractStateRequest): unknown;
    fromPartial(object: DeepPartial<QueryRawContractStateRequest>): QueryRawContractStateRequest;
};
export declare const QueryRawContractStateResponse: {
    encode(message: QueryRawContractStateResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryRawContractStateResponse;
    fromJSON(object: any): QueryRawContractStateResponse;
    toJSON(message: QueryRawContractStateResponse): unknown;
    fromPartial(object: DeepPartial<QueryRawContractStateResponse>): QueryRawContractStateResponse;
};
export declare const QuerySmartContractStateRequest: {
    encode(message: QuerySmartContractStateRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QuerySmartContractStateRequest;
    fromJSON(object: any): QuerySmartContractStateRequest;
    toJSON(message: QuerySmartContractStateRequest): unknown;
    fromPartial(object: DeepPartial<QuerySmartContractStateRequest>): QuerySmartContractStateRequest;
};
export declare const QuerySmartContractStateResponse: {
    encode(message: QuerySmartContractStateResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QuerySmartContractStateResponse;
    fromJSON(object: any): QuerySmartContractStateResponse;
    toJSON(message: QuerySmartContractStateResponse): unknown;
    fromPartial(object: DeepPartial<QuerySmartContractStateResponse>): QuerySmartContractStateResponse;
};
export declare const QueryCodeRequest: {
    encode(message: QueryCodeRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryCodeRequest;
    fromJSON(object: any): QueryCodeRequest;
    toJSON(message: QueryCodeRequest): unknown;
    fromPartial(object: DeepPartial<QueryCodeRequest>): QueryCodeRequest;
};
export declare const CodeInfoResponse: {
    encode(message: CodeInfoResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): CodeInfoResponse;
    fromJSON(object: any): CodeInfoResponse;
    toJSON(message: CodeInfoResponse): unknown;
    fromPartial(object: DeepPartial<CodeInfoResponse>): CodeInfoResponse;
};
export declare const QueryCodeResponse: {
    encode(message: QueryCodeResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryCodeResponse;
    fromJSON(object: any): QueryCodeResponse;
    toJSON(message: QueryCodeResponse): unknown;
    fromPartial(object: DeepPartial<QueryCodeResponse>): QueryCodeResponse;
};
export declare const QueryCodesRequest: {
    encode(message: QueryCodesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryCodesRequest;
    fromJSON(object: any): QueryCodesRequest;
    toJSON(message: QueryCodesRequest): unknown;
    fromPartial(object: DeepPartial<QueryCodesRequest>): QueryCodesRequest;
};
export declare const QueryCodesResponse: {
    encode(message: QueryCodesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryCodesResponse;
    fromJSON(object: any): QueryCodesResponse;
    toJSON(message: QueryCodesResponse): unknown;
    fromPartial(object: DeepPartial<QueryCodesResponse>): QueryCodesResponse;
};
export declare const QueryPinnedCodesRequest: {
    encode(message: QueryPinnedCodesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryPinnedCodesRequest;
    fromJSON(object: any): QueryPinnedCodesRequest;
    toJSON(message: QueryPinnedCodesRequest): unknown;
    fromPartial(object: DeepPartial<QueryPinnedCodesRequest>): QueryPinnedCodesRequest;
};
export declare const QueryPinnedCodesResponse: {
    encode(message: QueryPinnedCodesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryPinnedCodesResponse;
    fromJSON(object: any): QueryPinnedCodesResponse;
    toJSON(message: QueryPinnedCodesResponse): unknown;
    fromPartial(object: DeepPartial<QueryPinnedCodesResponse>): QueryPinnedCodesResponse;
};
/** Query provides defines the gRPC querier service */
export interface Query {
    /** ContractInfo gets the contract meta data */
    ContractInfo(request: DeepPartial<QueryContractInfoRequest>, metadata?: grpc.Metadata): Promise<QueryContractInfoResponse>;
    /** ContractHistory gets the contract code history */
    ContractHistory(request: DeepPartial<QueryContractHistoryRequest>, metadata?: grpc.Metadata): Promise<QueryContractHistoryResponse>;
    /** ContractsByCode lists all smart contracts for a code id */
    ContractsByCode(request: DeepPartial<QueryContractsByCodeRequest>, metadata?: grpc.Metadata): Promise<QueryContractsByCodeResponse>;
    /** AllContractState gets all raw store data for a single contract */
    AllContractState(request: DeepPartial<QueryAllContractStateRequest>, metadata?: grpc.Metadata): Promise<QueryAllContractStateResponse>;
    /** RawContractState gets single key from the raw store data of a contract */
    RawContractState(request: DeepPartial<QueryRawContractStateRequest>, metadata?: grpc.Metadata): Promise<QueryRawContractStateResponse>;
    /** SmartContractState get smart query result from the contract */
    SmartContractState(request: DeepPartial<QuerySmartContractStateRequest>, metadata?: grpc.Metadata): Promise<QuerySmartContractStateResponse>;
    /** Code gets the binary code and metadata for a singe wasm code */
    Code(request: DeepPartial<QueryCodeRequest>, metadata?: grpc.Metadata): Promise<QueryCodeResponse>;
    /** Codes gets the metadata for all stored wasm codes */
    Codes(request: DeepPartial<QueryCodesRequest>, metadata?: grpc.Metadata): Promise<QueryCodesResponse>;
    /** PinnedCodes gets the pinned code ids */
    PinnedCodes(request: DeepPartial<QueryPinnedCodesRequest>, metadata?: grpc.Metadata): Promise<QueryPinnedCodesResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    ContractInfo(request: DeepPartial<QueryContractInfoRequest>, metadata?: grpc.Metadata): Promise<QueryContractInfoResponse>;
    ContractHistory(request: DeepPartial<QueryContractHistoryRequest>, metadata?: grpc.Metadata): Promise<QueryContractHistoryResponse>;
    ContractsByCode(request: DeepPartial<QueryContractsByCodeRequest>, metadata?: grpc.Metadata): Promise<QueryContractsByCodeResponse>;
    AllContractState(request: DeepPartial<QueryAllContractStateRequest>, metadata?: grpc.Metadata): Promise<QueryAllContractStateResponse>;
    RawContractState(request: DeepPartial<QueryRawContractStateRequest>, metadata?: grpc.Metadata): Promise<QueryRawContractStateResponse>;
    SmartContractState(request: DeepPartial<QuerySmartContractStateRequest>, metadata?: grpc.Metadata): Promise<QuerySmartContractStateResponse>;
    Code(request: DeepPartial<QueryCodeRequest>, metadata?: grpc.Metadata): Promise<QueryCodeResponse>;
    Codes(request: DeepPartial<QueryCodesRequest>, metadata?: grpc.Metadata): Promise<QueryCodesResponse>;
    PinnedCodes(request: DeepPartial<QueryPinnedCodesRequest>, metadata?: grpc.Metadata): Promise<QueryPinnedCodesResponse>;
}
export declare const QueryDesc: {
    serviceName: string;
};
export declare const QueryContractInfoDesc: UnaryMethodDefinitionish;
export declare const QueryContractHistoryDesc: UnaryMethodDefinitionish;
export declare const QueryContractsByCodeDesc: UnaryMethodDefinitionish;
export declare const QueryAllContractStateDesc: UnaryMethodDefinitionish;
export declare const QueryRawContractStateDesc: UnaryMethodDefinitionish;
export declare const QuerySmartContractStateDesc: UnaryMethodDefinitionish;
export declare const QueryCodeDesc: UnaryMethodDefinitionish;
export declare const QueryCodesDesc: UnaryMethodDefinitionish;
export declare const QueryPinnedCodesDesc: UnaryMethodDefinitionish;
interface UnaryMethodDefinitionishR extends grpc.UnaryMethodDefinition<any, any> {
    requestStream: any;
    responseStream: any;
}
declare type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;
interface Rpc {
    unary<T extends UnaryMethodDefinitionish>(methodDesc: T, request: any, metadata: grpc.Metadata | undefined): Promise<any>;
}
export declare class GrpcWebImpl {
    private host;
    private options;
    constructor(host: string, options: {
        transport?: grpc.TransportFactory;
        debug?: boolean;
        metadata?: grpc.Metadata;
    });
    unary<T extends UnaryMethodDefinitionish>(methodDesc: T, _request: any, metadata: grpc.Metadata | undefined): Promise<any>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
