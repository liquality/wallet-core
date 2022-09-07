import { getAddress } from '@ethersproject/address';
import { toChecksumAddress, isValidAddress } from 'ethereumjs-util';
import { ensure0x } from '../utils';
import { BaseChain } from './BaseChain';

export class EvmChain extends BaseChain {
  public isValidAddress(address: string) {
    return isValidAddress(address);
  }

  public formatAddress(address: string) {
    return getAddress(address);
  }

  public isValidTransactionHash(hash: string) {
    return /^(0x)?([A-Fa-f0-9]{64})$/.test(hash);
  }

  public formatTransactionHash(hash: string) {
    return ensure0x(hash).toLowerCase();
  }
}

export class RskChain extends EvmChain {
  public formatAddressUI(address: string): string {
    return toChecksumAddress(ensure0x(address), this.network.chainId);
  }
}
