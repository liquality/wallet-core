import { WalletOptions } from '../types';

class WalletOptionsStore {
  walletOptions: WalletOptions;
  setOptions(options: WalletOptions) {
    this.walletOptions = options;
  }
}

const walletOptionsStore = new WalletOptionsStore();

export { walletOptionsStore };
