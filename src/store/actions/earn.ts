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

export const getDepositedAmount = async (
  context: ActionContext,
  { network, asset }: { network: Network; asset: string }
): Promise<number> => {
  console.log(context);
  const earnProvider = getEarnProvider(network, asset);

  return earnProvider.getDepositedAmount();
};

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

export const makeWithdraw = async (
  context: ActionContext,
  {
    network,
    asset,
    amount,
  }: {
    network: Network;
    asset: string;
    amount: string;
  }
): Promise<string> => {
  console.log(context);
  const earnProvider = getEarnProvider(network, asset);

  return earnProvider.deposit(amount);

  // TODO: Create history item and store it
};
