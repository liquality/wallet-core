import { BitcoinTypes } from '@liquality/bitcoin';
import { BitcoinLedgerProvider } from '@liquality/bitcoin-ledger';
import { ChainId } from '@liquality/cryptoassets';
import { EvmLedgerProvider } from '@liquality/evm-ledger';
import { Network as ChainifyNetwork } from '@liquality/types';
import { Network, RootState } from './store/types';

export interface ParsedCipherText {
  ct: string;
  iv: string;
  s: string;
}

export interface Notification {
  title: string;
  message: string;
}

export interface WalletOptions {
  initialState?: RootState;

  crypto: {
    pbkdf2(password: string, salt: string, iterations: number, length: number, digest: string): Promise<string>;
    encrypt(value: string, key: string): Promise<any>;
    decrypt(value: any, key: string): Promise<any>;
  };

  createNotification(notification: Notification): void;

  createBitcoinLedgerProvider?(
    network: Network,
    bitcoinNetwork: BitcoinTypes.BitcoinNetwork,
    addressType: string,
    baseDerivationPath: string
  ): BitcoinLedgerProvider;

  createEthereumLedgerProvider?(
    network: Network,
    ethereumNetwork: ChainifyNetwork,
    chain: ChainId,
    derivationPath: string,
    hardfork?: string
  ): EvmLedgerProvider;
}
