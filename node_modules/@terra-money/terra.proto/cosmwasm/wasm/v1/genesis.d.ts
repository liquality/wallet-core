import Long from "long";
import _m0 from "protobufjs/minimal";
import { Params, CodeInfo, ContractInfo, Model } from "../../../cosmwasm/wasm/v1/types";
import { MsgStoreCode, MsgInstantiateContract, MsgExecuteContract } from "../../../cosmwasm/wasm/v1/tx";
export declare const protobufPackage = "cosmwasm.wasm.v1";
/** GenesisState - genesis state of x/wasm */
export interface GenesisState {
    params?: Params;
    codes: Code[];
    contracts: Contract[];
    sequences: Sequence[];
    genMsgs: GenesisState_GenMsgs[];
}
/**
 * GenMsgs define the messages that can be executed during genesis phase in
 * order. The intention is to have more human readable data that is auditable.
 */
export interface GenesisState_GenMsgs {
    storeCode?: MsgStoreCode | undefined;
    instantiateContract?: MsgInstantiateContract | undefined;
    executeContract?: MsgExecuteContract | undefined;
}
/** Code struct encompasses CodeInfo and CodeBytes */
export interface Code {
    codeId: Long;
    codeInfo?: CodeInfo;
    codeBytes: Uint8Array;
    /** Pinned to wasmvm cache */
    pinned: boolean;
}
/** Contract struct encompasses ContractAddress, ContractInfo, and ContractState */
export interface Contract {
    contractAddress: string;
    contractInfo?: ContractInfo;
    contractState: Model[];
}
/** Sequence key and value of an id generation counter */
export interface Sequence {
    idKey: Uint8Array;
    value: Long;
}
export declare const GenesisState: {
    encode(message: GenesisState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GenesisState;
    fromJSON(object: any): GenesisState;
    toJSON(message: GenesisState): unknown;
    fromPartial(object: DeepPartial<GenesisState>): GenesisState;
};
export declare const GenesisState_GenMsgs: {
    encode(message: GenesisState_GenMsgs, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GenesisState_GenMsgs;
    fromJSON(object: any): GenesisState_GenMsgs;
    toJSON(message: GenesisState_GenMsgs): unknown;
    fromPartial(object: DeepPartial<GenesisState_GenMsgs>): GenesisState_GenMsgs;
};
export declare const Code: {
    encode(message: Code, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Code;
    fromJSON(object: any): Code;
    toJSON(message: Code): unknown;
    fromPartial(object: DeepPartial<Code>): Code;
};
export declare const Contract: {
    encode(message: Contract, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Contract;
    fromJSON(object: any): Contract;
    toJSON(message: Contract): unknown;
    fromPartial(object: DeepPartial<Contract>): Contract;
};
export declare const Sequence: {
    encode(message: Sequence, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Sequence;
    fromJSON(object: any): Sequence;
    toJSON(message: Sequence): unknown;
    fromPartial(object: DeepPartial<Sequence>): Sequence;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
