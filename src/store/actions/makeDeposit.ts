import { ActionContext } from '..';
import { getEarnProvider } from '../../factory/earnProvider';
import { Network } from '../types';

export const makeDeposit = async (
  context: ActionContext,
  {
    network,
    asset,
    amount,
  }: {
    network: Network;
    asset: string;
    amount: string;
    mnemonic: string;
  }
): Promise<string> => {
  console.log(context);
  const earnProvider = getEarnProvider(network, asset);

  return earnProvider.deposit(amount);

  // TODO: Create history item and store it
};
