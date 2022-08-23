import { MAINNET_SUPPORTED_CHAINS } from '../../chains';
import { IAsset } from '../../interfaces/IAsset';
import { IChain } from '../../interfaces/IChain';

export type AssetMap = Record<string, IAsset>;

const MAINNET_NATIVE_ASSETS = Object.values(MAINNET_SUPPORTED_CHAINS).reduce((result: AssetMap, chain: IChain) => {
  chain.nativeAsset.forEach((asset) => (result[asset.code] = asset));
  return result;
}, {});

export { MAINNET_NATIVE_ASSETS };
