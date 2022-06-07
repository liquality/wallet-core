import { EvmChainProvider, EvmWalletProvider } from '@chainify/evm';
import { AssetTypes, ChainId } from '@liquality/cryptoassets';
import axios from 'axios';
import EventEmitter from 'events';
import { findKey, mapKeys, mapValues, random } from 'lodash';
import cryptoassets from '../utils/cryptoassets';
import { ChainNetworks } from '../utils/networks';
import { Asset, Network, RootState, WalletId } from './types';

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

  const chainProvider = new EvmChainProvider(ChainNetworks.rsk.mainnet);
  const balances = await chainProvider.getBalance(addresses, rskERC20Assets as any);
  return balances.some((amount) => amount.isGreaterThan(0));
};

export async function getPrices(baseCurrencies: string[], toCurrency: string) {
  const coindIds = baseCurrencies
    .filter((currency) => cryptoassets[currency]?.coinGeckoId)
    .map((currency) => cryptoassets[currency].coinGeckoId);
  const { data } = await axios.get(
    `${COIN_GECKO_API}/simple/price?ids=${coindIds.join(',')}&vs_currencies=${toCurrency}`
  );
  let prices = mapKeys(data, (_, coinGeckoId) => findKey(cryptoassets, (asset) => asset.coinGeckoId === coinGeckoId));
  prices = mapValues(prices, (rates) => mapKeys(rates, (_, k) => k.toUpperCase()));

  for (const baseCurrency of baseCurrencies) {
    if (!prices[baseCurrency] && cryptoassets[baseCurrency]?.matchingAsset) {
      prices[baseCurrency] = prices[cryptoassets[baseCurrency].matchingAsset!];
    }
  }
  const symbolPrices = mapValues(prices, (rates) => rates[toCurrency.toUpperCase()]);
  return symbolPrices;
}
