import { ChainId, getChain } from '@liquality/cryptoassets';
import { v4 as uuidv4 } from 'uuid';
import { Account, AccountDefinition, Network, WalletId } from '../store/types';
import { getDerivationPath } from '../utils/derivationPath';

export const accountCreator = (payload: {
  network: Network;
  walletId: WalletId;
  account: AccountDefinition;
}): Account => {
  const { network, walletId, account } = payload;
  const { name, alias, chain, index, addresses, assets, balances, type, color, chainCode, publicKey } = account;

  const enabled = account.enabled !== null && account.enabled !== undefined ? account.enabled : true;

  const _addresses = addresses.map((a) => {
    return getChain(network, chain).formatAddress(a);
  });

  const derivationPath = account.derivationPath
    ? account.derivationPath
    : getDerivationPath(chain, network, index, type);
  const id = uuidv4();
  const createdAt = Date.now();

  return {
    id,
    walletId,
    type,
    name,
    alias,
    chain,
    index,
    derivationPath,
    addresses: _addresses,
    assets,
    balances: balances || {},
    createdAt,
    color,
    enabled,
    chainCode,
    publicKey,
  };
};

export const accountColors = [
  '#000000',
  '#1CE5C3',
  '#007AFF',
  '#4F67E4',
  '#9D4DFA',
  '#D421EB',
  '#FF287D',
  '#FE7F6B',
  '#EAB300',
  '#F7CA4F',
  '#A1E44A',
  '#3AB24D',
  '#8247E5',
  '#bf0205',
];

export const getNextAccountColor = (chain: ChainId, index: number) => {
  const defaultColor = getChain(Network.Mainnet, chain).color;
  if (!defaultColor) {
    throw new Error(`Default color for chain ${chain} not defined`);
  }
  const defaultIndex = accountColors.findIndex((c) => c === defaultColor);
  if (defaultIndex === -1) {
    return defaultColor;
  }
  const finalIndex = index + defaultIndex;
  if (finalIndex >= accountColors.length) {
    return accountColors[defaultIndex];
  }
  return accountColors[finalIndex];
};

export const ACCOUNT_TYPE_OPTIONS = [
  {
    name: 'ETH',
    label: 'ETH',
    type: 'ethereum_imported',
    chain: ChainId.Ethereum,
    blockchain: 'Ethereum Blockchain',
  },
  {
    name: 'BTC',
    label: 'BTC',
    type: 'bitcoin_imported',
    chain: ChainId.Bitcoin,
    blockchain: 'Bitcoin Blockchain',
  },
];
