"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cryptoassets_1 = require("@liquality/cryptoassets");
const migrations_1 = require("./migrations");
const types_1 = require("./types");
const initialState = {
    version: migrations_1.LATEST_VERSION,
    key: '',
    wallets: [],
    unlockedAt: 0,
    brokerReady: true,
    encryptedWallets: '',
    enabledAssets: {},
    customTokens: {},
    accounts: {},
    fiatRates: {},
    currenciesInfo: {},
    fees: {},
    history: {},
    marketData: {},
    activeNetwork: types_1.Network.Mainnet,
    activeWalletId: '',
    keyUpdatedAt: 0,
    keySalt: '',
    termsAcceptedAt: 0,
    setupAt: 0,
    injectEthereum: true,
    injectEthereumChain: cryptoassets_1.ChainId.Ethereum,
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
    whatsNewModalVersion: '',
    enabledChains: {},
    errorLog: [],
    customChainSeetings: {},
};
exports.default = initialState;
//# sourceMappingURL=state.js.map