import { ActionContext, rootActionContext } from '..';
import { Network, WalletId } from '../types';

export const removeCustomToken = async (
  context: ActionContext,
  { network, walletId, symbol }: { network: Network; walletId: WalletId; symbol: string }
) => {
  const { commit } = rootActionContext(context);
  commit.REMOVE_CUSTOM_TOKEN({ network, walletId, symbol });
};
