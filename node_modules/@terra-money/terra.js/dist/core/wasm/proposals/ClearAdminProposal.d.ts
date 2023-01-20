import { JSONSerializable } from '../../../util/json';
import { AccAddress } from '../../bech32';
import { Any } from '@terra-money/terra.proto/google/protobuf/any';
import { ClearAdminProposal as ClearAdminProposal_pb } from '@terra-money/terra.proto/cosmwasm/wasm/v1/proposal';
/**
 * ClearAdminProposal gov proposal content type to clear the admin of a
 * contract.
 */
export declare class ClearAdminProposal extends JSONSerializable<ClearAdminProposal.Amino, ClearAdminProposal.Data, ClearAdminProposal.Proto> {
    title: string;
    description: string;
    contract: AccAddress;
    /**
     * @param title a short summary
     * @param description a human readable text
     * @param contract the address of the smart contract
     */
    constructor(title: string, description: string, contract: AccAddress);
    static fromAmino(data: ClearAdminProposal.Amino, isClassic?: boolean): ClearAdminProposal;
    toAmino(isClassic?: boolean): ClearAdminProposal.Amino;
    static fromProto(proto: ClearAdminProposal.Proto, isClassic?: boolean): ClearAdminProposal;
    toProto(isClassic?: boolean): ClearAdminProposal.Proto;
    packAny(isClassic?: boolean): Any;
    static unpackAny(msgAny: Any, isClassic?: boolean): ClearAdminProposal;
    static fromData(data: ClearAdminProposal.Data, isClassic?: boolean): ClearAdminProposal;
    toData(isClassic?: boolean): ClearAdminProposal.Data;
}
export declare namespace ClearAdminProposal {
    interface Amino {
        type: 'wasm/ClearAdminProposal';
        value: {
            title: string;
            description: string;
            contract: AccAddress;
        };
    }
    interface Data {
        '@type': '/cosmwasm.wasm.v1.ClearAdminProposal';
        title: string;
        description: string;
        contract: AccAddress;
    }
    type Proto = ClearAdminProposal_pb;
}
