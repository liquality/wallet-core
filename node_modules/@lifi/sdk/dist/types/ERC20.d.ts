import { BaseContract, BigNumber, BigNumberish, CallOverrides, ContractTransaction, Overrides } from 'ethers';
export declare const ERC20_ABI: {
    name: string;
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    outputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
}[];
export interface ERC20Contract extends BaseContract {
    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;
    approve(spender: string, amount: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
}
