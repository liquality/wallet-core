import { getAllSupportedChains } from '../chains';
import { IAsset } from '../interfaces/IAsset';
import { ChainId, Network } from '../types';
import { CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP, MAINNET_ERC20_ASSETS } from './mainnet/erc20';
import { MAINNET_NATIVE_ASSETS } from './mainnet/native';

const MAINNET_ASSETS = { ...MAINNET_NATIVE_ASSETS, ...MAINNET_ERC20_ASSETS };

export { MAINNET_ASSETS, MAINNET_NATIVE_ASSETS, MAINNET_ERC20_ASSETS, CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP };

export function getAssetGasLimit(asset: IAsset, network: Network) {
  const chains = getAllSupportedChains();

  if (!chains[network]) {
    throw new Error(`Network ${network} missing`);
  }

  if (!chains[network]![asset.chain]) {
    throw new Error(`Chain ${asset.chain} is missing from ${network}`);
  }

  chains[network]![asset.chain]!.gasLimit;
}

export function getTokenByChainAndAddress(chain: ChainId, tokenAddress: string) {
  if (!CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP[chain]) {
    throw new Error(`Chain not found ${chain}`);
  }

  if (!CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP[chain][tokenAddress]) {
    throw new Error(`Token not found in chain ${chain} with token address ${tokenAddress}`);
  }

  return CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP[chain][tokenAddress];
}

export function getAllAssets() {
  return {
    mainnet: MAINNET_ASSETS,
    testnet: null,
  };
}

export function getAllNativeAssets() {
  return {
    mainnet: MAINNET_NATIVE_ASSETS,
    testnet: null,
  };
}

export function getAllNonNativeAssets() {
  return {
    mainnet: MAINNET_ERC20_ASSETS,
    testnet: null,
  };
}
