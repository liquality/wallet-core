import { ChainId, getAssetByAssetCode } from '@liquality/cryptoassets';

export const injectEthereumAssetChain = {
  // Inject ethereum asset -> chain
  version: 9,
  migrate: async (state: any) => {
    const injectEthereumChain =
      getAssetByAssetCode(state.activeNetwork, state.injectEthereumAsset).chain || ChainId.Ethereum;

    delete state.injectEthereumAsset;

    return { ...state, injectEthereumChain };
  },
};
