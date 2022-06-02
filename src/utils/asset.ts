import { AssetTypes, ChainId, chains, isEthereumChain as _isEthereumChain } from '@liquality/cryptoassets';
import axios from 'axios';
import * as ethers from 'ethers';
import buildConfig from '../build.config';
import { Asset, Network } from '../store/types';
import cryptoassets from '../utils/cryptoassets';
import tokenABI from './tokenABI.json';

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
  return cryptoassets[asset]?.feeAsset;
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

export interface TokenDetails {
  name: string;
  decimals: number;
  symbol: string;
}

export const tokenDetailProviders: {
  [key in ChainId]?: {
    getDetails(contractAddress: string): Promise<TokenDetails>;
  };
} = {
  ethereum: {
    async getDetails(contractAddress) {
      return await fetchTokenDetails(contractAddress, `https://mainnet.infura.io/v3/${buildConfig.infuraApiKey}`);
    },
  },
  polygon: {
    async getDetails(contractAddress) {
      return await fetchTokenDetails(contractAddress, 'https://polygon-rpc.com');
    },
  },
  rsk: {
    async getDetails(contractAddress) {
      return await fetchTokenDetails(contractAddress, buildConfig.rskRpcUrls.mainnet);
    },
  },
  bsc: {
    async getDetails(contractAddress) {
      return await fetchTokenDetails(contractAddress, 'https://bsc-dataseed.binance.org');
    },
  },
  arbitrum: {
    async getDetails(contractAddress) {
      return await fetchTokenDetails(contractAddress, 'https://arb1.arbitrum.io/rpc');
    },
  },
  terra: {
    async getDetails(contractAddress) {
      return await fetchTerraToken(contractAddress);
    },
  },
  avalanche: {
    async getDetails(contractAddress) {
      return await fetchTokenDetails(contractAddress, 'https://api.avax.network/ext/bc/C/rpc');
    },
  },
  fuse: {
    async getDetails(contractAddress) {
      return await fetchTokenDetails(contractAddress, 'https://rpc.fuse.io');
    },
  },
  solana: {
    async getDetails(contractAddress) {
      return await fetchSolanaTokens(contractAddress);
    },
  },
};

const fetchTokenDetails = async (contractAddress: string, rpcUrl: string) => {
  const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress.toLowerCase(), tokenABI, provider);

  const [decimals, name, symbol] = await Promise.all([contract.decimals(), contract.name(), contract.symbol()]);

  return { decimals, name, symbol };
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

export const fetchTerraToken = async (address: string) => {
  const {
    data: { mainnet: tokens },
  } = await axios.get('https://assets.terra.money/cw20/tokens.json');
  const token = tokens[address];
  const { symbol } = token;

  return {
    name: symbol,
    symbol,
    decimals: 6,
  };
};

export const fetchSolanaTokens = async (address: string) => {
  const {
    data: { tokens },
  } = await axios.get('https://token-list.solana.com/solana.tokenlist.json');
  const token = tokens.filter(
    (t: { address: string; decimals: number; name: string; symbol: string }) => t.address === address
  )[0];

  const { name, symbol, decimals } = token;

  return {
    name,
    symbol,
    decimals,
  };
};
