import base58 from 'bs58';
import { PublicKey } from '@solana/web3.js';
import { EvmChain } from './EvmChain';

const BASE58_LENGTH = 32;

export abstract class NonEvmChain extends EvmChain {
  public formatAddress(address: string) {
    return address;
  }

  public formatTransactionHash(hash: string) {
    return hash;
  }
}

export class SolanaChain extends NonEvmChain {
  public isValidAddress(address: string) {
    try {
      if (typeof address !== 'string') return false; // check is reliable when type is definitely a string
      new PublicKey(address); // throws if address is invalid
      return true;
    } catch (error) {
      return false;
    }
  }

  public isValidTransactionHash(_hash: string) {
    return true;
  }
}

export class NearChain extends NonEvmChain {
  public isValidAddress(address: string) {
    return address.endsWith('.near') || /^[0-9a-fA-F]{64}$/.test(address);
  }

  public isValidTransactionHash(hash: string) {
    try {
      const [txHash, address] = hash.split('_');
      return base58.decode(txHash).length === BASE58_LENGTH && this.isValidAddress(address);
    } catch (e) {
      return false;
    }
  }
}

export class TerraChain extends NonEvmChain {
  public isValidAddress(address: string) {
    return address.length === 44;
  }

  public isValidTransactionHash(hash: string) {
    return typeof hash === 'string' && hash.length === 64;
  }
}
