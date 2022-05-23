import { ChainId } from '@liquality/cryptoassets';
import { LATEST_VERSION } from './migrations';
import { Network, RootState } from './types';

const initialState: RootState = {
  version: LATEST_VERSION,

  // <do not keep these in localStorage>
  key: '',
  wallets: [],
  unlockedAt: 0,
  // </do not keep these in localStorage>

  brokerReady: true,

  encryptedWallets: '',

  enabledAssets: {},
  customTokens: {},

  accounts: {},

  fiatRates: {},
  fees: {},
  history: {},
  marketData: {},

  activeNetwork: Network.Mainnet,
  activeWalletId: '',

  keyUpdatedAt: 0,
  keySalt: '',
  termsAcceptedAt: 0,
  setupAt: 0,

  injectEthereum: true,
  injectEthereumChain: ChainId.Ethereum,
  usbBridgeWindowsId: 0,

  externalConnections: {},
  rskLegacyDerivation: false,
  analytics: {
    userId: '',
    acceptedDate: 0,
    askedDate: 0,
    askedTimes: 0,
    notAskAgain: false,
  },
  experiments: {},
  watsNewModalVersion: '',
  enabledChains: {},
  nftAssets: [],
  starredNFTs: [],
};

export default initialState;
