import Long from "long";
import _m0 from "protobufjs/minimal";
import { GenesisState as GenesisState1 } from "../../../../ibc/core/client/v1/genesis";
import { GenesisState as GenesisState2 } from "../../../../ibc/core/connection/v1/genesis";
import { GenesisState as GenesisState3 } from "../../../../ibc/core/channel/v1/genesis";
export declare const protobufPackage = "ibc.core.types.v1";
/** GenesisState defines the ibc module's genesis state. */
export interface GenesisState {
    /** ICS002 - Clients genesis state */
    clientGenesis?: GenesisState1;
    /** ICS003 - Connections genesis state */
    connectionGenesis?: GenesisState2;
    /** ICS004 - Channel genesis state */
    channelGenesis?: GenesisState3;
}
export declare const GenesisState: {
    encode(message: GenesisState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GenesisState;
    fromJSON(object: any): GenesisState;
    toJSON(message: GenesisState): unknown;
    fromPartial(object: DeepPartial<GenesisState>): GenesisState;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
