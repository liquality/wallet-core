import { ensure0x } from '@chainify/utils';
import { getAddress, isAddress } from '@ethersproject/address';
import { toChecksumAddress } from 'ethereumjs-util';
import { BaseChain } from './BaseChain';

export class EvmChain extends BaseChain {
  public isValidAddress(address: string) {
    return isAddress(address);
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
