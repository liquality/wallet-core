import { WalletOptions } from '../types';

const walletOptionsStore = {
  walletOptions: null as WalletOptions,
  setOptions(options: WalletOptions) {
    this.walletOptions = options;
  },
};

export { walletOptionsStore };
