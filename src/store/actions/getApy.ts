import { ActionContext } from '..';
import { getEarnProvider } from '../../factory/earnProvider';
import { Network } from '../types';

export const getApy = async (
  context: ActionContext,
  { network, asset }: { network: Network; asset: string }
): Promise<string> => {
  console.log('in apyyy', context);
  const earnProvider = getEarnProvider(network, asset);

  return earnProvider.getApy();
};
