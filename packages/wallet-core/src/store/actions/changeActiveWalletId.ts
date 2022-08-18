import { ActionContext, rootActionContext } from '..';
import { WalletId } from '../types';

export const changeActiveWalletId = async (context: ActionContext, { walletId }: { walletId: WalletId }) => {
  const { commit } = rootActionContext(context);
  commit.CHANGE_ACTIVE_WALLETID({ walletId });
};
