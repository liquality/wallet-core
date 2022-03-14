import { ChainId } from '@liquality/cryptoassets';

export enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

export interface RootState {
  version: number;

  // <do not keep these in localStorage>
  key: string;
  wallets: any[];
  unlockedAt: number;
  // </do not keep these in localStorage>

  brokerReady: true;

  encryptedWallets: string;

  enabledAssets: {};
  customTokens: {};

  accounts: {};

  fiatRates: {};
  fees: {};
  history: {};
  marketData: {};

  activeNetwork: Network;
  activeWalletId: string;
  activeAsset: string;

  keyUpdatedAt: number;
  keySalt: string;
  termsAcceptedAt: number;
  setupAt: number;

  injectEthereum: boolean;
  injectEthereumChain: ChainId;
  usbBridgeWindowsId: number;

  externalConnections: {};
  rskLegacyDerivation: boolean;
  analytics: {
    userId: string;
    acceptedDate: number;
    askedDate: number;
    askedTimes: number;
    notAskAgain: boolean;
  };
  experiments: {};
  watsNewModalVersion: string;
  enabledChains: {};
}
