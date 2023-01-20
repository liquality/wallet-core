import Long from "long";
import _m0 from "protobufjs/minimal";
import { Any } from "../../../google/protobuf/any";
export declare const protobufPackage = "cosmos.auth.v1beta1";
/**
 * BaseAccount defines a base account type. It contains all the necessary fields
 * for basic account functionality. Any custom account type should extend this
 * type for additional functionality (e.g. vesting).
 */
export interface BaseAccount {
    address: string;
    pubKey?: Any;
    accountNumber: Long;
    sequence: Long;
}
/** ModuleAccount defines an account for modules that holds coins on a pool. */
export interface ModuleAccount {
    baseAccount?: BaseAccount;
    name: string;
    permissions: string[];
}
/** Params defines the parameters for the auth module. */
export interface Params {
    maxMemoCharacters: Long;
    txSigLimit: Long;
    txSizeCostPerByte: Long;
    sigVerifyCostEd25519: Long;
    sigVerifyCostSecp256k1: Long;
}
export declare const BaseAccount: {
    encode(message: BaseAccount, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): BaseAccount;
    fromJSON(object: any): BaseAccount;
    toJSON(message: BaseAccount): unknown;
    fromPartial(object: DeepPartial<BaseAccount>): BaseAccount;
};
export declare const ModuleAccount: {
    encode(message: ModuleAccount, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): ModuleAccount;
    fromJSON(object: any): ModuleAccount;
    toJSON(message: ModuleAccount): unknown;
    fromPartial(object: DeepPartial<ModuleAccount>): ModuleAccount;
};
export declare const Params: {
    encode(message: Params, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Params;
    fromJSON(object: any): Params;
    toJSON(message: Params): unknown;
    fromPartial(object: DeepPartial<Params>): Params;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
