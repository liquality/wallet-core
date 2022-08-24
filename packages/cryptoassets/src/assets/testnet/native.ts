import { TESTNET_SUPPORTED_CHAINS } from '../../chains';
import { IChain } from '../../interfaces/IChain';
import { AssetMap } from '../../types';

const TESTNET_NATIVE_ASSETS = Object.values(TESTNET_SUPPORTED_CHAINS).reduce((result: AssetMap, chain: IChain) => {
  chain.nativeAsset.forEach((asset) => (result[asset.code] = asset));
  return result;
}, {});

export { TESTNET_NATIVE_ASSETS };
