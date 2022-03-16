import { ChainId } from '@liquality/cryptoassets';
import { LATEST_VERSION } from './migrations';
import { Network, RootState } from './types';

const initialState: RootState = {
  version: LATEST_VERSION,

  // <do not keep these in localStorage>
  key: null,
  wallets: [],
  unlockedAt: null,
  // </do not keep these in localStorage>

  brokerReady: true,

  encryptedWallets: null,

  enabledAssets: {},
  customTokens: {},

  accounts: {},

  fiatRates: {},
  fees: {},
  history: {},
  marketData: {},

  activeNetwork: Network.Testnet,
  activeWalletId: null,

  keyUpdatedAt: null,
  keySalt: null,
  termsAcceptedAt: null,
  setupAt: null,

  injectEthereum: true,
  injectEthereumChain: ChainId.Ethereum,
  usbBridgeWindowsId: 0,

  externalConnections: {},
  rskLegacyDerivation: false,
  analytics: {
    userId: null,
    acceptedDate: null,
    askedDate: null,
    askedTimes: 0,
    notAskAgain: false,
  },
  experiments: {},
  watsNewModalVersion: null,
  enabledChains: {},
};

export default initialState;
