import { HttpClient } from '@chainify/client';
import { EvmChainProvider, EvmWalletProvider } from '@chainify/evm';
import { AssetTypes, ChainId, getChain } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import EventEmitter from 'events';
import { findKey, mapKeys, mapValues, random } from 'lodash';
import cryptoassets from '../utils/cryptoassets';
import { Asset, AssetInfo, CurrenciesInfo, Network, RootState, WalletId } from './types';

export const CHAIN_LOCK: { [key: string]: boolean } = {};

export const emitter = new EventEmitter();

const wait = (millis: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), millis));

export { wait };

export const waitForRandom = (min: number, max: number) => wait(random(min, max));

export const timestamp = () => Date.now();

export const attemptToLockAsset = (network: Network, walletId: WalletId, asset: Asset) => {
  const chain = cryptoassets[asset].chain;
  const key = [network, walletId, chain].join('-');

  if (CHAIN_LOCK[key]) {
    return {
      key,
      success: false,
    };
  }

  CHAIN_LOCK[key] = true;

  return {
    key,
    success: true,
  };
};

export const unlockAsset = (key: string) => {
  CHAIN_LOCK[key] = false;

  emitter.emit(`unlock:${key}`);
};

const COIN_GECKO_API = 'https://api.coingecko.com/api/v3';

const getRskERC20Assets = () => {
  const erc20 = Object.keys(cryptoassets).filter(
    (asset) => cryptoassets[asset].chain === ChainId.Rootstock && cryptoassets[asset].type === AssetTypes.erc20
  );

  return erc20.map((erc) => cryptoassets[erc]);
};

export const shouldApplyRskLegacyDerivation = async (
  accounts: RootState['accounts'],
  mnemonic?: string,
  indexPath = 0
) => {
  const rskERC20Assets = getRskERC20Assets().map((asset) => {
    return { ...asset, isNative: asset.type === 'native' };
  });
  const walletIds = Object.keys(accounts);

  const addresses: string[] = [];

  walletIds.forEach((wallet) => {
    const walletAccounts = accounts[wallet]!.mainnet;

    walletAccounts.forEach((account) => {
      if (account.chain === ChainId.Rootstock) {
        addresses.push(...account.addresses);
      }
    });
  });

  if (mnemonic) {
    const walletProvider = new EvmWalletProvider({ mnemonic, derivationPath: `m/44'/137'/${indexPath}'/0/0` });
    const _addresses = await walletProvider.getAddresses();
    addresses.push(..._addresses.map((e) => e.address));
  }

  const rskMainnetNetwork = getChain(Network.Mainnet, ChainId.Rootstock).network;
  const chainProvider = new EvmChainProvider(rskMainnetNetwork);
  const balances = await chainProvider.getBalance(addresses, rskERC20Assets as any);
  return balances.some((amount) => amount.isGreaterThan(0));
};

export async function getPrices(baseCurrencies: string[], toCurrency: string) {
  const coindIds = baseCurrencies
    .filter((currency) => cryptoassets[currency]?.priceSource.coinGeckoId)
    .map((currency) => cryptoassets[currency].priceSource.coinGeckoId);
  const data = await HttpClient.get(
    `${COIN_GECKO_API}/simple/price?ids=${coindIds.join(',')}&vs_currencies=${toCurrency}`
  );
  let prices = mapKeys(data, (_, coinGeckoId) =>
    findKey(cryptoassets, (asset) => asset.priceSource.coinGeckoId === coinGeckoId)
  );
  prices = mapValues(prices, (rates) => mapKeys(rates, (_, k) => k.toUpperCase()));
  for (const baseCurrency of baseCurrencies) {
    if (!prices[baseCurrency] && cryptoassets[baseCurrency]?.matchingAsset) {
      prices[baseCurrency] = prices[cryptoassets[baseCurrency].matchingAsset!];
    }
  }
  const symbolPrices = mapValues(prices, (rates, key) => {
    const _toCurrency = toCurrency.toUpperCase();
    if (rates && rates[_toCurrency]) {
      return rates[_toCurrency];
    } else {
      console.error(`${_toCurrency} rate is missing for ${key}`);
    }
  });
  return symbolPrices;
}

export async function getCurrenciesInfo(baseCurrencies: string[]): Promise<CurrenciesInfo> {
  const coindIds = baseCurrencies
    .filter((currency) => cryptoassets[currency]?.priceSource.coinGeckoId)
    .map((currency) => ({
      asset: currency,
      coinGeckoId: cryptoassets[currency].priceSource.coinGeckoId,
    }));

  const data = (
    await Promise.all([
      HttpClient.get(
        `${COIN_GECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`
      ),
      HttpClient.get(
        `${COIN_GECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2&sparkline=false`
      ),
    ])
  ).flat();

  return coindIds.reduce((acc, currValue) => {
    const { coinGeckoId, asset } = currValue;
    const coinInfo = data.find((coin) => coin.id === coinGeckoId);

    return (acc = {
      ...acc,
      [asset]: coinInfo ? new BN(coinInfo.market_cap) : new BN(0),
    });
  }, {});
}

/*
  Sort chains

  First criteria: Total fiat balance - descending
  Second criteria: Market cap of their native asset - descending
  Third criteria: Alphabetical - (A - Z)
*/

export const orderChains = (
  firstChain: { totalFiatBalance: BN; nativeAssetMarketCap: BN; chain: string },
  secondChain: { totalFiatBalance: BN; nativeAssetMarketCap: BN; chain: string }
) => {
  if (firstChain.totalFiatBalance.gt(secondChain.totalFiatBalance)) {
    return -1;
  }

  if (secondChain.totalFiatBalance.gt(firstChain.totalFiatBalance)) {
    return 1;
  }

  if (firstChain.nativeAssetMarketCap.gt(secondChain.nativeAssetMarketCap)) {
    return -1;
  }

  if (secondChain.nativeAssetMarketCap.gt(firstChain.nativeAssetMarketCap)) {
    return 1;
  }

  return firstChain.chain < secondChain.chain ? -1 : 1;
};

/*
  Sort assets

  First goes with dollar
  second goes with token balance
  third goes with market cap

  if no dollar, first goes token balance, second market cap, third dollar value

  if no token balance, first goes market cap, second dollar value and third token balance
*/

export const orderAssets = (
  hasFiat: boolean,
  hasTokenBalance: boolean,
  sortedAssetsByFiat: AssetInfo[],
  sortedAssetsByMarketCap: AssetInfo[],
  sortedAssetsByTokenBalance: AssetInfo[]
) => {
  let orderedAssets = [];

  if (hasFiat) {
    orderedAssets = [...sortedAssetsByFiat];
    if (hasTokenBalance) {
      orderedAssets = [...orderedAssets, ...sortedAssetsByTokenBalance, ...sortedAssetsByMarketCap];
    } else {
      orderedAssets = [...orderedAssets, ...sortedAssetsByMarketCap, ...sortedAssetsByTokenBalance];
    }
  } else if (hasTokenBalance) {
    orderedAssets = [...sortedAssetsByTokenBalance, ...sortedAssetsByMarketCap, ...sortedAssetsByFiat];
  } else {
    orderedAssets = [...sortedAssetsByMarketCap, ...sortedAssetsByFiat, ...sortedAssetsByTokenBalance];
  }

  const nativeAssetIdx = orderedAssets.findIndex((asset: any) => asset.type === 'native');

  if (nativeAssetIdx !== -1) {
    const nativeAsset = orderedAssets.splice(nativeAssetIdx, 1)[0];

    return [nativeAsset, ...orderedAssets].map((asset) => asset.asset);
  }

  return orderedAssets.map((asset) => asset.asset);
};
