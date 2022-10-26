import base58 from 'bs58';
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
      const PUBLIC_KEY_LENGTH = 32;

      const publicKey = base58.decode(address);
      if (publicKey.length !== PUBLIC_KEY_LENGTH) return false;

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
