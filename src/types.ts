import { BitcoinLedgerProvider } from '@liquality/bitcoin-ledger-provider';
import { BitcoinNetwork } from '@liquality/bitcoin-networks';
import { ChainId } from '@liquality/cryptoassets';
import { EthereumLedgerProvider } from '@liquality/ethereum-ledger-provider';
import { EthereumNetwork } from '@liquality/ethereum-networks';
import { RootState } from './store/types';

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
    pbkdf2(
      password: string,
      salt: string,
      iterations: number,
      length: number,
      digest: string
    ): Promise<string>;
    encrypt(value: string, key: string): Promise<any>;
    decrypt(value: any, key: string): Promise<any>;
  };
  createNotification(notification: Notification): void;
  createBitcoinLedgerProvider?(
    network: BitcoinNetwork,
    addressType: string,
    baseDerivationPath: string
  ): BitcoinLedgerProvider;
  createEthereumLedgerProvider?(
    network: EthereumNetwork,
    chain: ChainId,
    derivationPath: string,
    hardfork: string
  ): EthereumLedgerProvider;
}
