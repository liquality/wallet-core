import { AssetTypes, ChainId, getChain, getNativeAssetCode, isEvmChain } from '@liquality/cryptoassets';
import { CUSTOM_ERRORS, wrapCustomError } from '@liquality/error-parser';
import * as ethers from 'ethers';
import { Asset, Network } from '../store/types';
import cryptoassets from '../utils/cryptoassets';

function getChainExplorer(chainId: ChainId, network: Network) {
  const chain = getChain(network, chainId);
  const chainExplorer = chain.explorerViews[0];
  if (!chainExplorer) {
    throw wrapCustomError(CUSTOM_ERRORS.NotFound.Chain.Explorer(chainId));
  }
  return chainExplorer;
}

export const isERC20 = (asset: Asset) => {
  return cryptoassets[asset]?.type === AssetTypes.erc20;
};

export const isChainEvmCompatible = (asset: Asset, network = Network.Mainnet) => {
  const chainId = cryptoassets[asset]?.chain;
  return isEvmChain(network, chainId);
};

export const isAssetEvmNativeAsset = (asset: Asset, network = Network.Mainnet) => {
  const chainId = cryptoassets[asset]?.chain;
  if (chainId) {
    const chain = getChain(network, chainId);

    if (chain.isEVM && chain.nativeAsset[0].code === asset) {
      return true;
    }
  }

  return false;
};

export const getNativeAsset = (asset: Asset, network = Network.Mainnet) => {
  if (cryptoassets[asset]?.type === AssetTypes.native) {
    return asset;
  }
  const chainId = cryptoassets[asset]?.chain;
  return chainId ? getNativeAssetCode(network, chainId) : asset;
};

export const getFeeAsset = (asset: Asset) => {
  if (!cryptoassets[asset]) {
    throw wrapCustomError(CUSTOM_ERRORS.NotFound.Asset.Default);
  }
  return cryptoassets[asset].feeAsset;
};

export const getAssetColorStyle = (asset: Asset) => {
  const assetData = cryptoassets[asset];
  if (assetData && assetData.color) {
    return { color: assetData.color };
  }
  // return black as default
  return { color: '#000000' };
};

export const getTransactionExplorerLink = (hash: string, asset: Asset, network: Network) => {
  const transactionHash = getExplorerTransactionHash(asset, hash);
  const chain = cryptoassets[asset].chain;
  const link = `${getChainExplorer(chain, network).tx}`;
  return link.replace('{hash}', transactionHash);
};

export const getAddressExplorerLink = (address: string, asset: Asset, network: Network) => {
  const chain = cryptoassets[asset].chain;
  const link = `${getChainExplorer(chain, network).address}`;
  return link.replace('{address}', address);
};

export const getExplorerTransactionHash = (asset: Asset, hash: string) => {
  switch (asset) {
    case 'NEAR':
      return hash.split('_')[0];
    default:
      return hash;
  }
};

export const estimateGas = async ({ data, to, value }: { data: string; to: string; value: ethers.BigNumber }) => {
  const paramsForGasEstimate = {
    data,
    to,
    value,
  };

  const provider = ethers.getDefaultProvider();

  return await provider.estimateGas(paramsForGasEstimate);
};

const NFT_ASSETS_MAP: {
  [key in ChainId]?: { [key in Network]: { marketplaceName: string; url: string; transfer: string } };
} = {
  ethereum: {
    testnet: {
      marketplaceName: 'OpenSea',
      url: `https://testnet.opensea.io/`,
      transfer: `https://testnets.opensea.io/assets/{contract_address}/{token_id}`,
    },
    mainnet: {
      marketplaceName: 'OpenSea',
      url: `https://opensea.io/`,
      transfer: `https://opensea.io/assets/{chain}/{contract_address}/{token_id}`,
    },
  },
  polygon: {
    testnet: {
      marketplaceName: 'OpenSea',
      url: `https://testnet.opensea.io/`,
      transfer: `https://testnets.opensea.io/assets/{contract_address}/{token_id}`,
    },
    mainnet: {
      marketplaceName: 'OpenSea',
      url: `https://opensea.io/`,
      transfer: `https://opensea.io/assets/{asset}/{contract_address}/{token_id}`,
    },
  },
  arbitrum: {
    testnet: {
      marketplaceName: 'StratosNFT',
      url: `https://testnet.stratosnft.io/`,
      transfer: `https://testnets.stratosnft.io/asset/{contract_address}/{token_id}`,
    },
    mainnet: {
      marketplaceName: 'StratosNFT',
      url: `https://stratosnft.io/`,
      transfer: `https://stratosnft.io/asset/{contract_address}/{token_id}`,
    },
  },
  solana: {
    testnet: {
      marketplaceName: 'Magic Eden',
      url: `https://magiceden.io/`,
      transfer: `https://magiceden.io/item-details/{contract_address}`,
    },
    mainnet: {
      marketplaceName: 'Magic Eden',
      url: `https://magiceden.io/`,
      transfer: `https://magiceden.io/item-details/{contract_address}`,
    },
  },
};

const getNftAssetsMap = (chainId: ChainId, network: Network) => {
  const nftAssetsMap = NFT_ASSETS_MAP[chainId];
  if (!nftAssetsMap) {
    throw wrapCustomError(CUSTOM_ERRORS.Unsupported.NftAssetMap(chainId, network));
  }
  return nftAssetsMap;
};

export const getMarketplaceName = (asset: Asset, network: Network) => {
  const chainId = cryptoassets[asset].chain;
  const nftAssetsMap = getNftAssetsMap(chainId, network);

  const marketplaceName = nftAssetsMap[network].marketplaceName;
  if (!marketplaceName) {
    throw wrapCustomError(CUSTOM_ERRORS.NotFound.Nft.MarketPlaceName(chainId, network));
  } else {
    return marketplaceName;
  }
};

export const getNftTransferLink = (asset: Asset, network: Network, tokenId: string, contract_address: string) => {
  const chainId = cryptoassets[asset].chain;
  const nftAssetsMap = getNftAssetsMap(chainId, network);

  const transferLink = nftAssetsMap[network].transfer;
  if (!transferLink) {
    throw wrapCustomError(CUSTOM_ERRORS.NotFound.Nft.TransferLink(chainId, network));
  } else {
    return transferLink
      .replace('{contract_address}', contract_address)
      .replace('{chain}', chainId)
      .replace('{asset}', asset)
      .replace('{token_id}', tokenId);
  }
};

export const getNftLink = (asset: Asset, network: Network) => {
  const chainId = cryptoassets[asset].chain;
  const nftAssetsMap = getNftAssetsMap(chainId, network);

  const url = nftAssetsMap[network].url;
  if (!url) {
    throw wrapCustomError(CUSTOM_ERRORS.NotFound.Nft.ExplorerLink(chainId, network));
  } else {
    return url;
  }
};

export const openseaLink = (network: Network) => {
  return `https://${network === 'testnet' ? 'testnets.' : ''}opensea.io/`;
};
