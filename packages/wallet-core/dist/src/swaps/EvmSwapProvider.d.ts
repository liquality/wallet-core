import { EvmTypes } from '@chainify/evm';
import { Transaction } from '@chainify/types';
import { SwapHistoryItem } from '../store/types';
import { SwapProvider } from './SwapProvider';
import { BaseSwapProviderConfig, NextSwapActionRequest, SwapRequest, SwapStatus } from './types';
export interface EvmSwapHistoryItem extends SwapHistoryItem {
    approveTxHash: string;
    approveTx: Transaction<EvmTypes.EthersTransactionResponse>;
}
export interface EvmSwapProviderConfig extends BaseSwapProviderConfig {
    routerAddress: string;
}
export declare abstract class EvmSwapProvider extends SwapProvider {
    config: EvmSwapProviderConfig;
    constructor(config: EvmSwapProviderConfig);
    requiresApproval(swapRequest: SwapRequest, approvalAddress?: string): Promise<boolean>;
    buildApprovalTx(swapRequest: SwapRequest, approveMax?: boolean, approvalAddress?: string): Promise<EvmTypes.EthersPopulatedTransaction | undefined>;
    approve(swapRequest: SwapRequest, approveMax?: boolean, approvalAddress?: string): Promise<{
        status: string;
        approveTx: Transaction<any>;
        approveTxHash: string;
    } | {
        status: string;
        approveTx?: undefined;
        approveTxHash?: undefined;
    }>;
    waitForApproveConfirmations(swapRequest: NextSwapActionRequest<EvmSwapHistoryItem>): Promise<{
        endTime: number;
        status: string;
    } | undefined>;
    protected _getStatuses(): Record<string, SwapStatus>;
}
