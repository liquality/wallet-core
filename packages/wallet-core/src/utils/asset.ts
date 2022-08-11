import { AssetTypes, ChainId, chains, isEthereumChain as _isEthereumChain } from '@liquality/cryptoassets';
import * as ethers from 'ethers';
import { Asset, Network } from '../store/types';
import cryptoassets from '../utils/cryptoassets';

type ExplorerMap = { [key in ChainId]?: { [key in Network]: { tx: string; address: string } } };

const EXPLORERS: ExplorerMap = {
  ethereum: {
    testnet: {
      tx: 'https://ropsten.etherscan.io/tx/{hash}',
      address: 'https://ropsten.etherscan.io/address/{hash}',
    },
    mainnet: {
      tx: 'https://etherscan.io/tx/{hash}',
      address: 'https://etherscan.io/address/{hash}',
    },
  },
  bitcoin: {
    testnet: {
      tx: 'https://blockstream.info/testnet/tx/{hash}',
      address: 'https://blockstream.info/testnet/address/{hash}',
    },
    mainnet: {
      tx: 'https://blockstream.info/tx/{hash}',
      address: 'https://blockstream.info/address/{hash}',
    },
  },
  rsk: {
    testnet: {
      tx: 'https://explorer.testnet.rsk.co/tx/{hash}',
      address: 'https://explorer.testnet.rsk.co/address/{hash}',
    },
    mainnet: {
      tx: 'https://explorer.rsk.co/tx/{hash}',
      address: 'https://explorer.rsk.co/address/{hash}',
    },
  },
  bsc: {
    testnet: {
      tx: 'https://testnet.bscscan.com/tx/{hash}',
      address: 'https://testnet.bscscan.com/address/{hash}',
    },
    mainnet: {
      tx: 'https://bscscan.com/tx/{hash}',
      address: 'https://bscscan.com/address/{hash}',
    },
  },
  polygon: {
    testnet: {
      tx: 'https://mumbai.polygonscan.com/tx/{hash}',
      address: 'https://mumbai.polygonscan.com/address/{hash}',
    },
    mainnet: {
      tx: 'https://polygonscan.com/tx/{hash}',
      address: 'https://polygonscan.com/address/{hash}',
    },
  },
  near: {
    testnet: {
      tx: 'https://explorer.testnet.near.org/transactions/{hash}',
      address: 'https://explorer.testnet.near.org/accounts/{hash}',
    },
    mainnet: {
      tx: 'https://explorer.mainnet.near.org/transactions/{hash}',
      address: 'https://explorer.mainnet.near.org/accounts/{hash}',
    },
  },
  solana: {
    testnet: {
      tx: 'https://explorer.solana.com/tx/{hash}?cluster=devnet',
      address: 'https://explorer.solana.com/address/{hash}?cluster=devnet',
    },
    mainnet: {
      tx: 'https://explorer.solana.com/tx/{hash}',
      address: 'https://explorer.solana.com/address/{hash}',
    },
  },
  arbitrum: {
    testnet: {
      tx: 'https://rinkeby-explorer.arbitrum.io/tx/{hash}',
      address: 'https://rinkeby-explorer.arbitrum.io/address/{hash}',
    },
    mainnet: {
      tx: 'https://explorer.arbitrum.io/tx/{hash}',
      address: 'https://explorer.arbitrum.io/address/{hash}',
    },
  },
  avalanche: {
    testnet: {
      tx: 'https://testnet.snowtrace.io/tx/{hash}',
      address: 'https://testnet.snowtrace.io/address/{hash}',
    },
    mainnet: {
      tx: 'https://snowtrace.io/tx/{hash}',
      address: 'https://snowtrace.io/address/{hash}',
    },
  },
  terra: {
    testnet: {
      tx: 'https://finder.terra.money/bombay-12/tx/{hash}',
      address: 'https://finder.terra.money/bombay-12/address/{hash}',
    },
    mainnet: {
      tx: 'https://finder.terra.money/columbus-5/tx/{hash}',
      address: 'https://finder.terra.money/columbus-5/address/{hash}',
    },
  },
  fuse: {
    testnet: {
      tx: 'https://explorer.fusespark.io/tx/{hash}',
      address: 'https://explorer.fusespark.io/address/{hash}',
    },
    mainnet: {
      tx: 'https://explorer.fuse.io/tx/{hash}',
      address: 'https://explorer.fuse.io/address/{hash}',
    },
  },
};

function getChainExplorer(chain: ChainId) {
  const chainExplorer = EXPLORERS[chain];
  if (!chainExplorer) {
    throw new Error(`Explorer definition not found for chain ${chain}`);
  }
  return chainExplorer;
}

export const isERC20 = (asset: Asset) => {
  return cryptoassets[asset]?.type === AssetTypes.erc20;
};

export const isEthereumChain = (asset: Asset) => {
  const chain = cryptoassets[asset]?.chain;
  return _isEthereumChain(chain);
};

export const isEthereumNativeAsset = (asset: Asset) => {
  const chainId = cryptoassets[asset]?.chain;
  if (chainId && _isEthereumChain(chainId) && chains[chainId].nativeAsset === asset) {
    return true;
  }

  return false;
};

export const getNativeAsset = (asset: Asset) => {
  if (cryptoassets[asset]?.type === AssetTypes.native) return asset;

  const chainId = cryptoassets[asset]?.chain;
  return chainId ? chains[chainId].nativeAsset : asset;
};

export const getFeeAsset = (asset: Asset) => {
  if (!cryptoassets[asset]) {
    throw new Error('Asset does not exist');
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
  const link = `${getChainExplorer(chain)[network].tx}`;

  return link.replace('{hash}', transactionHash);
};

export const getAddressExplorerLink = (address: string, asset: Asset, network: Network) => {
  const chain = cryptoassets[asset].chain;
  const link = `${getChainExplorer(chain)[network].address}`;

  return link.replace('{hash}', address);
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
};

const getNftAssetsMap = (chainId: ChainId, network: Network) => {
  const nftAssetsMap = NFT_ASSETS_MAP[chainId];
  if (!nftAssetsMap) {
    throw new Error(`NFT asset map for ${chainId} ${network} is not supported`);
  }
  return nftAssetsMap;
};

export const getMarketplaceName = (asset: Asset, network: Network) => {
  const chainId = cryptoassets[asset].chain;
  const nftAssetsMap = getNftAssetsMap(chainId, network);

  const marketplaceName = nftAssetsMap[network].marketplaceName;
  if (!marketplaceName) {
    throw new Error(`Marketplace name for ${chainId} ${network} not defined`);
  } else {
    return marketplaceName;
  }
};

export const getNftTransferLink = (asset: Asset, network: Network, tokenId: string, contract_address: string) => {
  const chainId = cryptoassets[asset].chain;
  const nftAssetsMap = getNftAssetsMap(chainId, network);

  const transferLink = nftAssetsMap[network].transfer;
  if (!transferLink) {
    throw new Error(`Transfer link for ${chainId} ${network} not defined`);
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
    throw new Error(`Nft explorer link for ${chainId} ${network} not defined`);
  } else {
    return url;
  }
};

export const openseaLink = (network: Network) => {
  return `https://${network === 'testnet' ? 'testnets.' : ''}opensea.io/`;
};
