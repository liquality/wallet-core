import { Client } from '@chainify/client';
import { FeeDetails, Nullable } from '@chainify/types';
import { ChainifyNetwork } from '../types';
import { ChainId, IAsset } from '@liquality/cryptoassets';
import { BigNumber } from 'bignumber.js';
import { Account, AccountId, AccountType, Asset as AssetType, HistoryItem, Network, NFT, NFTCollections, NFTWithAccount, WalletId } from './types';
declare type Cryptoassets = {
    [asset: string]: IAsset;
};
declare const _default: {
    client(context_0: any, context_1: any): ({ network, walletId, chainId, accountId, useCache, accountType, accountIndex, }: {
        network: Network;
        walletId: WalletId;
        chainId: ChainId;
        accountId?: string | undefined;
        useCache?: boolean | undefined;
        accountType?: AccountType | undefined;
        accountIndex?: number | undefined;
    }) => Client;
    historyItemById(context_0: any, context_1: any): (network: Network, walletId: WalletId, id: string) => HistoryItem | undefined;
    cryptoassets(context_0: any, context_1: any): Cryptoassets;
    networkAccounts(context_0: any, context_1: any): Account[];
    networkAssets(context_0: any, context_1: any): AssetType[];
    allNetworkAssets(context_0: any, context_1: any): AssetType[];
    activity(context_0: any, context_1: any): HistoryItem[];
    totalFiatBalance(context_0: any, context_1: any): BigNumber;
    accountItem(context_0: any, context_1: any): (accountId: AccountId) => Account | undefined;
    suggestedFeePrices(context_0: any, context_1: any): (asset: AssetType) => FeeDetails | undefined;
    accountsWithBalance(context_0: any, context_1: any): Account[];
    accountsData(context_0: any, context_1: any): Account[];
    accountFiatBalance(context_0: any, context_1: any): (walletId: WalletId, network: Network, accountId: AccountId) => BigNumber;
    assetFiatBalance(context_0: any, context_1: any): (asset: AssetType, balance: BigNumber) => BigNumber | null;
    assetMarketCap(context_0: any, context_1: any): (asset: AssetType) => Nullable<BigNumber>;
    chainAssets(context_0: any, context_1: any): {
        bitcoin?: string[] | undefined;
        ethereum?: string[] | undefined;
        rsk?: string[] | undefined;
        bsc?: string[] | undefined;
        near?: string[] | undefined;
        polygon?: string[] | undefined;
        arbitrum?: string[] | undefined;
        solana?: string[] | undefined;
        fuse?: string[] | undefined;
        terra?: string[] | undefined;
        avalanche?: string[] | undefined;
        optimism?: string[] | undefined;
    };
    analyticsEnabled(context_0: any, context_1: any): boolean;
    allNftCollections(context_0: any, context_1: any): NFTCollections<NFTWithAccount>;
    accountNftCollections(context_0: any, context_1: any): (accountId: AccountId) => NFTCollections<NFT>;
    mergedChainSettings(context_0: any, context_1: any): Record<ChainId, ChainifyNetwork>;
    chainSettings(context_0: any, context_1: any): {
        chain: string;
        asset: string;
        network: ChainifyNetwork;
    }[];
};
export default _default;
