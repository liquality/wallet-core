import { Client } from '@chainify/client';
import { FeeDetails, Nullable } from '@chainify/types';
import { AssetTypes, ChainId, getAllAssets, IAsset, unitToCurrency } from '@liquality/cryptoassets';
import { CUSTOM_ERRORS, wrapCustomError } from '@liquality/error-parser';
import BN, { BigNumber } from 'bignumber.js';
import { mapValues, orderBy, uniq } from 'lodash';
import { rootGetterContext } from '.';
import { createClient } from '../factory';
import { cryptoToFiat } from '../utils/coinFormatter';
import { getDerivationPath } from '../utils/derivationPath';
import { Networks } from '../utils/networks';
import {
  Account,
  AccountId,
  AccountInfo,
  AccountType,
  Asset as AssetType,
  AssetInfo,
  CurrenciesInfo,
  HistoryItem,
  Network,
  NFT,
  NFTCollections,
  NFTWithAccount,
  WalletId,
} from './types';
import { orderAssets, orderChains } from './utils';

const clientCache: { [key: string]: Client } = {};

type GetterContext = [any, any];

type Cryptoassets = { [asset: string]: IAsset };

export default {
  client(...context: GetterContext) {
    const { state, getters } = rootGetterContext(context);
    return ({
      network,
      walletId,
      chainId,
      accountId,
      useCache = true,
      accountType = AccountType.Default,
      accountIndex = 0,
    }: {
      network: Network;
      walletId: WalletId;
      chainId: ChainId;
      accountId?: AccountId;
      useCache?: boolean;
      accountType?: AccountType;
      accountIndex?: number;
    }): Client => {
      const account = accountId ? getters.accountItem(accountId) : null;
      const _accountType = account?.type || accountType;
      const _accountIndex = account?.index || accountIndex;

      if (account && chainId !== account.chain) {
        throw wrapCustomError(CUSTOM_ERRORS.Invalid.AssetChainNotAccountChain(chainId, accountId as string));
      }

      let derivationPath: string;
      // when we ask for ledger accounts from the ledger device we don't have the derivation path
      // the !account doesn't exist in this case or if we call the getter with accountId equals to null
      if (_accountType.includes('ledger') || !account) {
        derivationPath = getDerivationPath(chainId, network, _accountIndex, _accountType);
      } else {
        derivationPath = account.derivationPath;
      }
      const cacheKey = [chainId, network, walletId, derivationPath, _accountType].join('-');

      if (useCache) {
        const cachedClient = clientCache[cacheKey];
        if (cachedClient) return cachedClient;
      }

      const wallet = state.wallets.find((w) => w.id === walletId);

      if (!wallet) {
        throw wrapCustomError(CUSTOM_ERRORS.NotFound.Wallet);
      }

      const { mnemonic } = wallet;
      const accountInfo: AccountInfo = {
        type: _accountType,
        derivationPath,
        chainCode: account?.chainCode,
        publicKey: account?.publicKey,
        address: account?.addresses.length || 0 > 0 ? account?.addresses[0] : undefined,
      };
      const client = createClient(chainId, network, mnemonic, accountInfo);
      clientCache[cacheKey] = client;

      return client;
    };
  },
  historyItemById(...context: GetterContext) {
    const { state } = rootGetterContext(context);
    return (network: Network, walletId: WalletId, id: string): HistoryItem | undefined =>
      state.history[network]![walletId].find((i) => i.id === id);
  },
  cryptoassets(...context: GetterContext): Cryptoassets {
    const { state } = rootGetterContext(context);
    const { activeNetwork, activeWalletId } = state;

    const baseAssets = getAllAssets()[activeNetwork];

    const customAssets = state.customTokens[activeNetwork]?.[activeWalletId]?.reduce((assets, token) => {
      return Object.assign(assets, {
        [token.symbol]: {
          ...baseAssets.DAI, // Use DAI as template for custom tokens
          ...token,
          code: token.symbol,
        },
      });
    }, {});

    return Object.assign({}, baseAssets, customAssets);
  },
  networkAccounts(...context: GetterContext): Account[] {
    const { state } = rootGetterContext(context);
    const { activeNetwork, activeWalletId, accounts } = state;
    return accounts[activeWalletId]?.[activeNetwork]?.filter((a) => a.enabled) || [];
  },
  networkAssets(...context: GetterContext): AssetType[] {
    const { state } = rootGetterContext(context);
    const { enabledAssets, activeNetwork, activeWalletId } = state;
    return enabledAssets[activeNetwork]![activeWalletId];
  },
  allNetworkAssets(...context: GetterContext): AssetType[] {
    const { state } = rootGetterContext(context);
    return Networks.reduce((result: AssetType[], network) => {
      return uniq(result.concat(state.enabledAssets[network]![state.activeWalletId]));
    }, []);
  },
  activity(...context: GetterContext): HistoryItem[] {
    const { state } = rootGetterContext(context);
    const { history, activeNetwork, activeWalletId } = state;
    if (!history[activeNetwork]) return [];
    if (!history[activeNetwork]![activeWalletId]) return [];
    return history[activeNetwork]![activeWalletId].slice().reverse();
  },
  totalFiatBalance(...context: GetterContext): BigNumber {
    const { state, getters } = rootGetterContext(context);
    const { activeNetwork, activeWalletId } = state;
    const { accountsData, accountFiatBalance } = getters;
    return accountsData
      .filter((a) => a.type === AccountType.Default && a.enabled)
      .map((a) => accountFiatBalance(activeWalletId, activeNetwork, a.id))
      .reduce((accum, rawBalance) => {
        const convertedBalance = new BigNumber(rawBalance);
        const balance = convertedBalance.isNaN() ? 0 : convertedBalance;
        return accum.plus(balance || 0);
      }, new BigNumber(0));
  },
  accountItem(...context: GetterContext) {
    const { getters } = rootGetterContext(context);
    const { accountsData } = getters;

    return (accountId: AccountId): Account | undefined => {
      const account = accountsData.find((a) => a.id === accountId && a.enabled);
      return account;
    };
  },
  suggestedFeePrices(...context: GetterContext) {
    const { state } = rootGetterContext(context);
    return (asset: AssetType): FeeDetails | undefined => {
      return state.fees?.[state.activeNetwork]?.[state.activeWalletId]?.[asset];
    };
  },
  accountsWithBalance(...context: GetterContext): Account[] {
    const { getters } = rootGetterContext(context);
    const { accountsData } = getters;
    return accountsData
      .map((account) => {
        const balances = Object.entries(account.balances)
          .filter(([, balance]) => new BigNumber(balance).gt(0))
          .reduce((accum, [asset, balance]) => {
            return {
              ...accum,
              [asset]: balance,
            };
          }, {});
        return {
          ...account,
          balances,
        };
      })
      .filter((account) => account.balances && Object.keys(account.balances).length > 0);
  },
  accountsData(...context: GetterContext): Account[] {
    const { state, getters } = rootGetterContext(context);
    const { accounts, activeNetwork, activeWalletId, enabledChains } = state;
    const { accountFiatBalance, assetFiatBalance, assetMarketCap, cryptoassets } = getters;

    const _accounts = accounts[activeWalletId]?.[activeNetwork]
      ? accounts[activeWalletId]![activeNetwork].filter(
          (account) =>
            account.assets &&
            account.enabled &&
            account.assets.length > 0 &&
            enabledChains[activeWalletId]?.[activeNetwork]?.includes(account.chain)
        )
          .map((account) => {
            /*
              Calculate fiat balances and asset balances
              Sort and group assets by dollar value / token amount / market cap
          */
            const totalFiatBalance = accountFiatBalance(activeWalletId, activeNetwork, account.id);
            const assetsWithFiat: AssetInfo[] = [];
            const assetsWithMarketCap: AssetInfo[] = [];
            const assetsWithTokenBalance: AssetInfo[] = [];
            let assetsMarketCap: CurrenciesInfo = {} as any;
            let hasFiat = false;
            let hasTokenBalance = false;
            let nativeAssetMarketCap = new BigNumber(0);

            const fiatBalances = Object.entries(account.balances).reduce((accum, [asset, balance]) => {
              const fiat = assetFiatBalance(asset, new BigNumber(balance));
              const marketCap = assetMarketCap(asset);
              const tokenBalance = account.balances[asset];
              let type = AssetTypes.erc20;
              let matchingAsset;

              const assetByCode = cryptoassets[asset];

              if (assetByCode) {
                type = assetByCode.type;
                matchingAsset = assetByCode.matchingAsset;
              }

              if (fiat) {
                hasFiat = true;
                assetsWithFiat.push({ asset, type, amount: fiat });
              } else if (marketCap) {
                if (type === AssetTypes.native && !matchingAsset) {
                  nativeAssetMarketCap = marketCap;
                }

                assetsWithMarketCap.push({ asset, type, amount: marketCap || new BigNumber(0) });
              } else {
                if (!hasTokenBalance) {
                  hasTokenBalance = new BigNumber(tokenBalance).gt(0);
                }

                assetsWithTokenBalance.push({ asset, type, amount: new BigNumber(tokenBalance) });
              }

              assetsMarketCap = {
                ...assetsMarketCap,
                [asset]: marketCap || new BigNumber(0),
              };

              return {
                ...accum,
                [asset]: fiat,
              };
            }, {});

            const sortedAssetsByFiat = orderBy(assetsWithFiat, 'amount', 'desc');
            const sortedAssetsByMarketCap = orderBy(assetsWithMarketCap, 'amount', 'desc');
            const sortedAssetsByTokenBalance = orderBy(assetsWithTokenBalance, 'amount', 'desc');

            const orderedAssets = orderAssets(
              hasFiat,
              hasTokenBalance,
              sortedAssetsByFiat,
              sortedAssetsByMarketCap,
              sortedAssetsByTokenBalance
            );

            return {
              ...account,
              assets: orderedAssets.length ? orderedAssets : account.assets,
              nativeAssetMarketCap,
              assetsMarketCap,
              fiatBalances,
              totalFiatBalance,
            };
          })
          .sort(orderChains)
          .reduce((acc: { [key: string]: Account[] }, account) => {
            /*
              Group sorted assets by chain / multiaccount ordering
          */
            const { chain } = account;

            acc[chain] = acc[chain] ?? [];
            acc[chain].push(account);

            return acc;
          }, {})
      : [];
    return Object.values(_accounts).flat();
  },
  accountFiatBalance(...context: GetterContext) {
    const { state, getters } = rootGetterContext(context);
    const { accounts } = state;
    const { assetFiatBalance } = getters;
    return (walletId: WalletId, network: Network, accountId: AccountId): BigNumber => {
      const account = accounts[walletId]?.[network].find((a) => a.id === accountId);
      if (account) {
        return Object.entries(account.balances).reduce((accum, [asset, balance]) => {
          const fiat = assetFiatBalance(asset, new BigNumber(balance));
          return accum.plus(fiat || 0);
        }, new BN(0));
      }
      return new BN(0);
    };
  },
  assetFiatBalance(...context: GetterContext) {
    const { state, getters } = rootGetterContext(context);
    const { fiatRates } = state;
    const { cryptoassets } = getters;
    return (asset: AssetType, balance: BigNumber): BigNumber | null => {
      if (fiatRates && fiatRates[asset] && balance?.gt(0)) {
        const amount = unitToCurrency(cryptoassets[asset], balance);
        // TODO: coinformatter types are messed up and this shouldn't require `as BigNumber`
        return cryptoToFiat(amount, fiatRates[asset]) as BigNumber;
      }
      return null;
    };
  },
  assetMarketCap(...context: GetterContext) {
    const { state } = rootGetterContext(context);
    const { currenciesInfo } = state;

    return (asset: AssetType): Nullable<BigNumber> => {
      if (currenciesInfo && currenciesInfo[asset]) {
        const marketCap = currenciesInfo[asset];
        return new BigNumber(marketCap);
      }
      return null;
    };
  },
  chainAssets(...context: GetterContext): { [key in ChainId]?: AssetType[] } {
    // Sort crypto assets
    const { getters } = rootGetterContext(context);
    const { accountsWithBalance, accountsData, cryptoassets } = getters;

    // By dollar amount
    const data: { [key in string]: string[] } = accountsWithBalance.reduce((acc, { chain, assets, balances }) => {
      return {
        ...acc,
        [chain]: assets.filter((asset) => Object.keys(balances).includes(asset)),
      };
    }, {});

    // By token balance
    accountsData.forEach(({ assets, chain }) => {
      data[chain] = data[chain] ?? [];

      assets.reduce((acc, asset) => {
        if (!data[chain].includes(asset)) {
          return {
            ...acc,
            [chain]: data[chain].push(asset),
          };
        }

        return data;
      }, {});
    });

    Object.entries(cryptoassets).reduce((acc, [asset, { chain }]) => {
      data[chain] = data[chain] ?? [];

      if (!data[chain].includes(asset)) {
        return {
          ...acc,
          [chain]: data[chain].push(asset),
        };
      }
      return data;
    }, {});

    return data;
  },
  analyticsEnabled(...context: GetterContext): boolean {
    const { state } = rootGetterContext(context);
    return !!(state.analytics && state.analytics.acceptedDate != null && state.analytics.acceptedDate > 0);
  },
  allNftCollections(...context: GetterContext): NFTCollections<NFTWithAccount> {
    const { getters } = rootGetterContext(context);
    const accounts = getters.accountsData;
    const allNftCollections = accounts.reduce((allCollections: NFTCollections<NFTWithAccount>, account: Account) => {
      const collections = getters.accountNftCollections(account.id);
      const collectionsWithAccount = mapValues(collections, (nfts) => {
        return nfts.map((nft: NFT) => ({ ...nft, accountId: account.id }));
      });
      return { ...allCollections, ...collectionsWithAccount };
    }, {});
    return allNftCollections;
  },
  accountNftCollections(...context: GetterContext) {
    const { getters } = rootGetterContext(context);
    return (accountId: AccountId): NFTCollections<NFT> => {
      const account = getters.accountItem(accountId);
      if (!account?.nfts || !account.nfts.length) return {};

      return account.nfts.reduce((collections: NFTCollections<NFT>, nft: NFT) => {
        (collections[nft.collection!.name] ||= []).push(nft);
        collections[nft.collection!.name].sort((nftA: NFT, nftB: NFT) => {
          return nftA.starred === nftB.starred ? 0 : nftA.starred ? -1 : 1;
        });
        return collections;
      }, {});
    };
  },
};
