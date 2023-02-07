/// <reference types="node" />
import { Client } from '@chainify/client';
import BN from 'bignumber.js';
import EventEmitter from 'events';
import { Asset, AssetInfo, CurrenciesInfo, Network, RootState, WalletId } from './types';
export declare const clientCache: {
    [key: string]: Client;
};
export declare const CHAIN_LOCK: {
    [key: string]: boolean;
};
export declare const emitter: EventEmitter;
declare const wait: (millis: number) => Promise<void>;
export { wait };
export declare const waitForRandom: (min: number, max: number) => Promise<void>;
export declare const timestamp: () => number;
export declare const attemptToLockAsset: (network: Network, walletId: WalletId, asset: Asset) => {
    key: string;
    success: boolean;
};
export declare const unlockAsset: (key: string) => void;
export declare const shouldApplyRskLegacyDerivation: (accounts: RootState['accounts'], mnemonic?: string, indexPath?: number) => Promise<boolean>;
export declare function getPrices(baseCurrencies: string[], toCurrency: string): Promise<{
    [x: string]: any;
}>;
export declare function getCurrenciesInfo(baseCurrencies: string[]): Promise<CurrenciesInfo>;
export declare const orderChains: (firstChain: {
    totalFiatBalance: BN;
    nativeAssetMarketCap: BN;
    chain: string;
}, secondChain: {
    totalFiatBalance: BN;
    nativeAssetMarketCap: BN;
    chain: string;
}) => 1 | -1;
export declare const orderAssets: (hasFiat: boolean, hasTokenBalance: boolean, sortedAssetsByFiat: AssetInfo[], sortedAssetsByMarketCap: AssetInfo[], sortedAssetsByTokenBalance: AssetInfo[]) => string[];
