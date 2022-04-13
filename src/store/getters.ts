import { Asset, assets as cryptoassets, unitToCurrency } from '@liquality/cryptoassets';
import { rootGetterContext } from '.';
import { createClient } from './factory/client';
import { createSwapProvider } from './factory/swapProvider';
import BN from 'bignumber.js';
import { cryptoToFiat } from '../utils/coinFormatter';
import { Networks } from '../utils/networks';
import { uniq } from 'lodash';
import { getDerivationPath } from '../utils/derivationPath';
import { Client } from '@liquality/client';
import { AccountType, HistoryItem } from './types';

const clientCache = {};
const swapProviderCache = {};

const TESTNET_CONTRACT_ADDRESSES = {
  DAI: '0xad6d458402f60fd3bd25163575031acdce07538d',
  SOV: '0x6a9A07972D07E58f0daF5122D11e069288A375fB',
  PWETH: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
  SUSHI: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  ANC: 'terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc',
};
const TESTNET_ASSETS: { [asset: string]: Asset } = [
  'BTC',
  'ETH',
  'RBTC',
  'DAI',
  'BNB',
  'SOV',
  'NEAR',
  'MATIC',
  'PWETH',
  'ARBETH',
  'AVAX',
  'SOL',
  'SUSHI',
  'LUNA',
  'UST',
  'ANC',
  'FUSE',
].reduce((assets, asset) => {
  return Object.assign(assets, {
    [asset]: {
      ...cryptoassets[asset],
      contractAddress: TESTNET_CONTRACT_ADDRESSES[asset],
    },
  });
}, {});

const mapLegacyProvidersToSupported = {
  oneinchV3: 'oneinchV4',
  liqualityBoost: 'liqualityBoostNativeToERC20',
};

type GetterContext = [any, any];

export default {
  client(...context: GetterContext) {
    const { state, getters } = rootGetterContext(context);
    return ({
      network,
      walletId,
      asset,
      accountId,
      useCache = true,
      accountType = AccountType.Default,
      accountIndex = 0,
    }): Client => {
      const account = accountId ? getters.accountItem(accountId) : null;
      const _accountType = account?.type || accountType;
      const _accountIndex = account?.index || accountIndex;
      const { chain } = getters.cryptoassets[asset] || cryptoassets[asset];
      let derivationPath;
      // when we ask for ledger accounts from the ledger device we don't have the derivation path
      // the !account doesn't exist in this case or if we call the getter with accountId equals to null
      if (_accountType.includes('ledger') || !account) {
        derivationPath = getDerivationPath(chain, network, _accountIndex, _accountType);
      } else {
        derivationPath = account.derivationPath;
      }
      const cacheKey = [asset, chain, network, walletId, derivationPath, _accountType].join('-');

      if (useCache) {
        const cachedClient = clientCache[cacheKey];
        if (cachedClient) return cachedClient;
      }

      const wallet = state.wallets.find((w) => w.id === walletId);

      if (!wallet) {
        throw new Error('Wallet not found.');
      }

      const { mnemonic } = wallet;
      const client = createClient(asset, network, mnemonic, _accountType, derivationPath);
      clientCache[cacheKey] = client;

      return client;
    };
  },
  swapProvider() {
    return (network, providerId) => {
      const supportedProviderId = mapLegacyProvidersToSupported[providerId]
        ? mapLegacyProvidersToSupported[providerId]
        : providerId;
      const cacheKey = [network, supportedProviderId].join('-');

      const cachedSwapProvider = swapProviderCache[cacheKey];
      if (cachedSwapProvider) return cachedSwapProvider;

      const swapProvider = createSwapProvider(network, supportedProviderId);
      swapProviderCache[cacheKey] = swapProvider;

      return swapProvider;
    };
  },
  historyItemById(...context: GetterContext) {
    const { state } = rootGetterContext(context);
    return (network, walletId, id): HistoryItem => state.history[network][walletId].find((i) => i.id === id);
  },
  cryptoassets(...context: GetterContext) {
    const { state } = rootGetterContext(context);
    const { activeNetwork, activeWalletId } = state;

    const baseAssets = state.activeNetwork === 'testnet' ? TESTNET_ASSETS : cryptoassets;

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
  networkAccounts(...context: GetterContext) {
    const { state } = rootGetterContext(context);
    const { activeNetwork, activeWalletId, accounts } = state;
    return accounts[activeWalletId]?.[activeNetwork]?.filter((a) => a.enabled) || [];
  },
  networkAssets(...context: GetterContext) {
    const { state } = rootGetterContext(context);
    const { enabledAssets, activeNetwork, activeWalletId } = state;
    return enabledAssets[activeNetwork][activeWalletId];
  },
  allNetworkAssets(...context: GetterContext) {
    const { state } = rootGetterContext(context);
    return Networks.reduce((result, network) => {
      return uniq(result.concat(state.enabledAssets[network][state.activeWalletId]));
    }, []);
  },
  activity(...context: GetterContext) {
    const { state } = rootGetterContext(context);
    const { history, activeNetwork, activeWalletId } = state;
    if (!history[activeNetwork]) return [];
    if (!history[activeNetwork][activeWalletId]) return [];
    return history[activeNetwork][activeWalletId].slice().reverse();
  },
  totalFiatBalance(...context: GetterContext) {
    const { state, getters } = rootGetterContext(context);
    const { activeNetwork, activeWalletId } = state;
    const { accountsData, accountFiatBalance } = getters;
    return accountsData
      .filter((a) => a.type === AccountType.Default && a.enabled)
      .map((a) => accountFiatBalance(activeWalletId, activeNetwork, a.id))
      .reduce((accum, rawBalance) => {
        const convertedBalance = new BN(rawBalance);
        const balance = convertedBalance.isNaN() ? 0 : convertedBalance;
        return accum.plus(balance || 0);
      }, new BN(0));
  },
  accountItem(...context: GetterContext) {
    const { getters } = rootGetterContext(context);
    const { accountsData } = getters;
    return (accountId) => {
      const account = accountsData.find((a) => a.id === accountId && a.enabled);
      return account;
    };
  },
  accountsWithBalance(...context: GetterContext) {
    const { getters } = rootGetterContext(context);
    const { accountsData } = getters;
    return accountsData
      .map((account) => {
        const balances = Object.entries(account.balances)
          // @ts-ignore TODO: typed getters
          .filter(([, balance]) => new BN(balance).gt(0))
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
  accountsData(...context: GetterContext) {
    const { state, getters } = rootGetterContext(context);
    const { accounts, activeNetwork, activeWalletId, enabledChains } = state;
    const { accountFiatBalance, assetFiatBalance } = getters;
    return accounts[activeWalletId]?.[activeNetwork]
      .filter(
        (account) =>
          account.assets &&
          account.enabled &&
          account.assets.length > 0 &&
          enabledChains[activeWalletId]?.[activeNetwork]?.includes(account.chain)
      )
      .map((account) => {
        const totalFiatBalance = accountFiatBalance(activeWalletId, activeNetwork, account.id);
        const fiatBalances = Object.entries(account.balances).reduce((accum, [asset, balance]) => {
          const fiat = assetFiatBalance(asset, balance);
          return {
            ...accum,
            [asset]: fiat,
          };
        }, {});
        return {
          ...account,
          fiatBalances,
          totalFiatBalance,
        };
      })
      .sort((a, b) => {
        if (a.type.includes('ledger') || a.chain < b.chain) {
          return -1;
        }

        return 0;
      });
  },
  accountFiatBalance(...context: GetterContext) {
    const { state, getters } = rootGetterContext(context);
    const { accounts } = state;
    const { assetFiatBalance } = getters;
    return (walletId, network, accountId) => {
      const account = accounts[walletId]?.[network].find((a) => a.id === accountId);
      if (account) {
        return Object.entries(account.balances).reduce((accum, [asset, balance]) => {
          const fiat = assetFiatBalance(asset, balance);
          return accum.plus(fiat || 0);
        }, new BN(0));
      }
      return new BN(0);
    };
  },
  assetFiatBalance(...context: GetterContext) {
    const { state } = rootGetterContext(context);
    const { fiatRates } = state;
    return (asset, balance) => {
      if (fiatRates && fiatRates[asset] && balance) {
        const amount = unitToCurrency(cryptoassets[asset], balance);
        return cryptoToFiat(amount, fiatRates[asset]);
      }
      return null;
    };
  },
  chainAssets(...context: GetterContext) {
    const { getters } = rootGetterContext(context);
    const { cryptoassets } = getters;

    const chainAssets = Object.entries(cryptoassets).reduce((chains, [asset, assetData]) => {
      // @ts-ignore TODO: typed getters
      const assets = assetData.chain in chains ? chains[assetData.chain] : [];
      return Object.assign({}, chains, {
        // @ts-ignore TODO: typed getters
        [assetData.chain]: [...assets, asset],
      });
    }, {});
    return chainAssets;
  },
  analyticsEnabled(...context: GetterContext) {
    const { state } = rootGetterContext(context);
    if (state.analytics && state.analytics.acceptedDate != null) {
      return true;
    }
    return false;
  },
};
