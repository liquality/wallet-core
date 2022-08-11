import base58 from 'bs58';
import * as cashaddr from 'cashaddrjs';

const BASE58_LENGTH = 32;

export const isValidHexWith0xPrefix = (hash: string) => /^(0x)?([A-Fa-f0-9]{64})$/.test(hash);
export const isValidHexWithout0xPrefix = (hash: string) => /^([A-Fa-f0-9]{64})$/.test(hash);
export const toLowerCaseWithout0x = (hash: string) => hash.toLowerCase().replace(/0x/g, '');
export const with0x = (hash: string) => (hash.startsWith('0x') ? hash : '0x' + hash);

export const isValidNearAddress = (address: string) => address.endsWith('.near') || /^[0-9a-fA-F]{64}$/.test(address);

export const isValidNearTx = (hash: string) => {
  try {
    const [txHash, address] = hash.split('_');
    return base58.decode(txHash).length === BASE58_LENGTH && isValidNearAddress(address);
  } catch (e) {
    return false;
  }
};

export const isValidBitcoinCashAddress = (address: string) => {
  try {
    if (!address.includes(':')) address = 'bitcoincash:' + address;
    const { prefix, type, hash } = cashaddr.decode(address);
    if (['bitcoincash', 'bchtest', 'bchreg'].includes(prefix)) {
      return false;
    }
    if (['P2PKH', 'P2SH'].includes(type)) {
      return false;
    }
    return hash.length == 20;
  } catch (e) {
    return false;
  }
};

export const formatBitcoinCashAddress = (address: string) => {
  address = address.toLowerCase();
  if (address.startsWith('bitcoincash:')) address = address.slice(12);
  return address;
};

export const isValidSolanaAddress = (address: string): boolean => {
  return typeof address === 'string' && address.length >= 32 && address.length <= 44;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isValidSolanaTx = (_tx: string): boolean => {
  return true;
};

export const isValidTerraAddress = (address: string): boolean => {
  const terraAddressesLength = 44;

  return address.length === terraAddressesLength;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isValidTerraTx = (tx: string): boolean => {
  return typeof tx === 'string' && tx.length === 64;
};

export const getRSKChainID = (network: string) => {
  if (network == 'mainnet') return 30;
  if (network == 'testnet') return 31;
};
