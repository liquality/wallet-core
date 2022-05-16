import { ChainId } from '@liquality/cryptoassets';

// Add network to custom tokens
export const addNetworkCustomTokens = {
  version: 3,
  migrate: async (state: any) => {
    const customTokens = {
      mainnet: {
        [state.activeWalletId]: state.customTokens?.mainnet?.[state.activeWalletId].map((token: any) => ({
          ...token,
          network: ChainId.Ethereum,
        })),
      },
      testnet: {
        [state.activeWalletId]: state.customTokens?.testnet?.[state.activeWalletId].map((token: any) => ({
          ...token,
          network: ChainId.Ethereum,
        })),
      },
    };
    return { ...state, customTokens };
  },
};
