import { ensure0x } from '@chainify/utils';
import validateBitcoinAddress from 'bitcoin-address-validation';
import { BaseChain } from './BaseChain';

export abstract class UtxoChain extends BaseChain {
  public formatAddress(address: string) {
    return address;
  }

  public isValidTransactionHash(hash: string) {
    return /^([A-Fa-f0-9]{64})$/.test(hash);
  }

  public formatTransactionHash(hash: string) {
    return ensure0x(hash).toLowerCase();
  }
}

export class BitcoinChain extends UtxoChain {
  public isValidAddress(address: string): boolean {
    // networkId = mainnet | testnet | regtest
    return !!validateBitcoinAddress(address, String(this.network.networkId));
  }
}
