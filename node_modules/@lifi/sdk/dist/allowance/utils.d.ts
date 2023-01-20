import { ChainId, Token } from '@lifi/types';
import BigNumber from 'bignumber.js';
import { ContractTransaction, Signer } from 'ethers';
import { RevokeTokenData } from '../types';
export declare const getApproved: (signer: Signer, tokenAddress: string, contractAddress: string) => Promise<BigNumber>;
export declare const setApproval: (signer: Signer, tokenAddress: string, contractAddress: string, amount: string) => Promise<ContractTransaction>;
export declare const getAllowanceViaMulticall: (signer: Signer, chainId: ChainId, tokenData: RevokeTokenData[]) => Promise<{
    token: Token;
    approvalAddress: string;
    approvedAmount: BigNumber;
}[]>;
export declare const groupByChain: (tokenDataList: RevokeTokenData[]) => {
    [chainId: number]: RevokeTokenData[];
};
