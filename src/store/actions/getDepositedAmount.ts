import { ActionContext } from '..';
import { getEarnProvider } from '../../factory/earnProvider';
import { Network } from '../types';

export const getDepositedAmount = async (
  context: ActionContext,
  { network, asset }: { network: Network; asset: string }
): Promise<number> => {
  console.log(context);
  const earnProvider = getEarnProvider(network, asset);

  return earnProvider.getDepositedAmount();
};
