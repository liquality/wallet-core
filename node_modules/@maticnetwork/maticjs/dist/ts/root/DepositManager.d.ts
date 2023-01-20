import BN from 'bn.js';
import { Contract } from 'web3-eth-contract';
import ContractsBase from '../common/ContractsBase';
import Web3Client from '../common/Web3Client';
import { address, MaticClientInitializationOptions, SendOptions } from '../types/Common';
import Registry from './Registry';
export default class DepositManager extends ContractsBase {
    static NEW_DEPOSIT_EVENT_SIG: string;
    depositManagerContract: Contract;
    childChainContract: Contract;
    private registry;
    constructor(options: MaticClientInitializationOptions, web3Client: Web3Client, registry: Registry);
    initialize(): Promise<void>;
    depositStatusFromTxHash(txHash: string): Promise<{
        receipt: import("web3-core").TransactionReceipt;
        deposits: any[];
    }>;
    isDepositProcessed(depositId: any): any;
    approveERC20(token: address, amount: BN | string, options?: SendOptions): Promise<any>;
    approveMaxERC20(token: address, options?: SendOptions): Promise<any>;
    allowanceOfERC20(userAddress: address, token: address, options?: SendOptions): Promise<any>;
    depositERC20(token: address, amount: BN | string, options?: SendOptions): Promise<any>;
    depositERC721(token: address, tokenId: string, options?: SendOptions): any;
    depositBulk(tokens: address[], amountOrTokenIds: string[], user: address, options?: SendOptions): any;
    depositERC20ForUser(token: address, amount: BN | string, user: address, options?: SendOptions): Promise<any>;
    depositERC721ForUser(token: address, tokenId: string, user: address, options?: SendOptions): any;
    depositEther(amount: BN | string, options?: SendOptions): Promise<any>;
    getAddress(): string;
}
