import { FeeDetails } from '@chainify/types';
import { getAsset } from '@liquality/cryptoassets';
import { ActionContext, rootActionContext } from '..';
import { Asset } from '../types';

export const updateFees = async (context: ActionContext, { asset }: { asset: Asset }): Promise<FeeDetails> => {
  const { commit, getters, state } = rootActionContext(context);
  const network = state.activeNetwork;
  const walletId = state.activeWalletId;

  const chainId = getAsset(network, asset).chain;
  const fees = await getters.client({ network, walletId, chainId }).chain.getFees();

  commit.UPDATE_FEES({ network, walletId, asset, fees });

  return fees;
};
