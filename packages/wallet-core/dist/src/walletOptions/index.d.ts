import { WalletOptions } from '../types';
declare class WalletOptionsStore {
    walletOptions: WalletOptions;
    setOptions(options: WalletOptions): void;
}
declare const walletOptionsStore: WalletOptionsStore;
export { walletOptionsStore };
