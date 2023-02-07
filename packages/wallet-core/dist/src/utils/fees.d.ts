import { ChainId, EIP1559Fee, FeeDetail, FeeDetails, FeeType } from '@chainify/types';
import BN from 'bignumber.js';
import { AccountId, Asset, Network, NFT } from '../store/types';
declare type FeeUnits = {
    [asset: Asset]: number;
};
interface FeeDetailsWithCustom extends FeeDetails {
    custom: FeeDetail;
}
declare type SendFees = {
    [speed in keyof FeeDetailsWithCustom]: BN;
};
declare function newSendFees(): SendFees;
declare const FEE_OPTIONS: {
    SLOW: {
        name: string;
        label: string;
    };
    AVERAGE: {
        name: string;
        label: string;
    };
    FAST: {
        name: string;
        label: string;
    };
    CUSTOM: {
        name: string;
        label: string;
    };
};
declare function getSendFee(asset: Asset, feePrice: number, l1FeePrice?: number, network?: Network): BN;
declare function getTxFee(units: FeeUnits, _asset: Asset, _feePrice: number): BN;
declare function getFeeLabel(fee: string): string;
declare function isEIP1559Fees(chain: ChainId): boolean;
declare function probableFeePerUnitEIP1559(suggestedGasFee: EIP1559Fee): number;
declare function maxFeePerUnitEIP1559(suggestedGasFee: EIP1559Fee): number;
declare function feePerUnit(suggestedGasFee: FeeType, chain: ChainId): number;
declare function getSendTxFees(accountId: AccountId, asset: Asset, amount?: BN, customFee?: FeeType): Promise<SendFees>;
declare function sendTxFeesInNativeAsset(asset: Asset, suggestedGasFees: FeeDetailsWithCustom, sendFees?: SendFees): SendFees;
declare function sendBitcoinTxFees(accountId: AccountId, asset: Asset, suggestedGasFees: FeeDetailsWithCustom, amount?: BN, sendFees?: SendFees): Promise<SendFees>;
declare function estimateTransferNFT(accountId: AccountId, network: Network, receiver: string, values: number[], nft: NFT, customFee?: FeeType): Promise<SendFees>;
export { FEE_OPTIONS, getSendFee, getTxFee, getFeeLabel, isEIP1559Fees, getSendTxFees, sendTxFeesInNativeAsset, sendBitcoinTxFees, probableFeePerUnitEIP1559, maxFeePerUnitEIP1559, feePerUnit, newSendFees, estimateTransferNFT, };
