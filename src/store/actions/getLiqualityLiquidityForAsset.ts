import { ActionContext } from '..';
import { getSwapProvider } from '../../factory/swap';
import { LiqualitySwapProvider } from '../../swaps/liquality/LiqualitySwapProvider';
import { Network } from '../types';

export const getLiqualityLiquidityForAsset = async (
  _context: ActionContext,
  { asset, network }: { asset: string; network: Network }
): Promise<number> => {
  const swapProvider = getSwapProvider(network, 'liquality') as LiqualitySwapProvider;

  return swapProvider.getAssetLiquidity(asset);
};
