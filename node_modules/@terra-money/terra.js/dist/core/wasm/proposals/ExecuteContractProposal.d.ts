import { JSONSerializable } from '../../../util/json';
import { AccAddress } from '../../bech32';
import { Coins } from '../../Coins';
import { Any } from '@terra-money/terra.proto/google/protobuf/any';
import { ExecuteContractProposal as ExecuteContractProposal_pb } from '@terra-money/terra.proto/cosmwasm/wasm/v1/proposal';
/**
 * ExecuteContractProposal gov proposal content type to call execute on a
 * contract.
 */
export declare class ExecuteContractProposal extends JSONSerializable<ExecuteContractProposal.Amino, ExecuteContractProposal.Data, ExecuteContractProposal.Proto> {
    title: string;
    description: string;
    run_as: AccAddress;
    contract: AccAddress;
    execute_msg: object | string;
    coins: Coins;
    /**
     * @param title a short summary
     * @param description a human readable text
     * @param run_as contract user
     * @param contract contract address
     * @param execute_msg HandleMsg to pass as arguments for contract invocation
     * @param coins coins to be sent to contract
     */
    constructor(title: string, description: string, run_as: AccAddress, contract: AccAddress, execute_msg: object | string, coins?: Coins.Input);
    static fromAmino(data: ExecuteContractProposal.Amino, isClassic?: boolean): ExecuteContractProposal;
    toAmino(isClassic?: boolean): ExecuteContractProposal.Amino;
    static fromProto(proto: ExecuteContractProposal.Proto, isClassic?: boolean): ExecuteContractProposal;
    toProto(isClassic?: boolean): ExecuteContractProposal.Proto;
    packAny(isClassic?: boolean): Any;
    static unpackAny(msgAny: Any, isClassic?: boolean): ExecuteContractProposal;
    static fromData(data: ExecuteContractProposal.Data, isClassic?: boolean): ExecuteContractProposal;
    toData(isClassic?: boolean): ExecuteContractProposal.Data;
}
export declare namespace ExecuteContractProposal {
    interface Amino {
        type: 'wasm/ExecuteContractProposal';
        value: {
            title: string;
            description: string;
            run_as: AccAddress;
            contract: AccAddress;
            msg: object | string;
            funds: Coins.Amino;
        };
    }
    interface Data {
        '@type': '/cosmwasm.wasm.v1.ExecuteContractProposal';
        title: string;
        description: string;
        run_as: AccAddress;
        contract: AccAddress;
        msg: object | string;
        funds: Coins.Data;
    }
    type Proto = ExecuteContractProposal_pb;
}
