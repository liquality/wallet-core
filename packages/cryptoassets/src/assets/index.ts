import { getAllSupportedChains } from '../chains';
import { IAsset } from '../interfaces/IAsset';
import { GasLimitsType } from '../interfaces/IGasLimit';
import { AssetTypes, ChainId, Network } from '../types';
import { CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP, MAINNET_ERC20_ASSETS } from './mainnet/erc20';
import { MAINNET_NATIVE_ASSETS } from './mainnet/native';
import { CHAIN_TO_TESTNET_TOKEN_ADDRESS_MAP, TESTNET_ERC20_ASSETS } from './testnet/erc20';
import { TESTNET_NATIVE_ASSETS } from './testnet/native';

// Mainnet
const MAINNET_ASSETS = { ...MAINNET_NATIVE_ASSETS, ...MAINNET_ERC20_ASSETS };
// Testnet
const TESTNET_ASSETS = { ...TESTNET_NATIVE_ASSETS, ...TESTNET_ERC20_ASSETS };

// Mainnet
export { MAINNET_ASSETS, MAINNET_NATIVE_ASSETS, MAINNET_ERC20_ASSETS, CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP };
// Testnet
export { TESTNET_ASSETS, TESTNET_NATIVE_ASSETS, TESTNET_ERC20_ASSETS, CHAIN_TO_TESTNET_TOKEN_ADDRESS_MAP };

function _getAssetSendGasLimit(asset: IAsset, network: Network, key: GasLimitsType) {
  const chains = getAllSupportedChains();

  if (!chains[network]) {
    throw new Error(`Network ${network} missing`);
  }

  if (!chains[network]![asset.chain]) {
    throw new Error(`Chain ${asset.chain} is missing from ${network}`);
  }

  if (asset.type == AssetTypes.native) {
    return chains[network]![asset.chain]!.gasLimit[key]?.native;
  } else {
    return chains[network]![asset.chain]!.gasLimit[key]?.nonNative;
  }
}

export function getAssetSendGasLimit(asset: IAsset, network: Network) {
  return _getAssetSendGasLimit(asset, network, 'send');
}

export function getAssetSendL1GasLimit(asset: IAsset, network: Network) {
  return _getAssetSendGasLimit(asset, network, 'sendL1');
}

export function getAsset(network: Network, asset: string) {
  return getAllAssets()[network][asset];
}

export function getToken(chain: ChainId, tokenAddress: string) {
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
    testnet: TESTNET_ASSETS,
  };
}

export function getAllNativeAssets() {
  return {
    mainnet: MAINNET_NATIVE_ASSETS,
    testnet: TESTNET_NATIVE_ASSETS,
  };
}

export function getAllNonNativeAssets() {
  return {
    mainnet: MAINNET_ERC20_ASSETS,
    testnet: TESTNET_ERC20_ASSETS,
  };
}
