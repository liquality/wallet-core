import { ChainId, chains } from '@liquality/cryptoassets';
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
    const address = chains[chain].formatAddress(a, network);
    return address.startsWith('0x') ? address.substring(2, address.length) : address;
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
    publicKey
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
];

export const chainDefaultColors: { [key in ChainId]?: string } = {
  bitcoin: '#EAB300',
  ethereum: '#4F67E4',
  rsk: '#3AB24D',
  bsc: '#F7CA4F',
  near: '#000000',
  solana: '#008080',
  polygon: '#8247E5',
  arbitrum: '#28A0EF',
  terra: '#008080',
  fuse: '#46e8b6',
  avalanche: '#E84141',
};

export const getNextAccountColor = (chain: ChainId, index: number) => {
  const defaultColor = chainDefaultColors[chain];
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
