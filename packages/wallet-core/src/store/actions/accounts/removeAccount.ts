import { ActionContext, rootActionContext } from '../..';
import { Network, WalletId } from '../../types';

export const removeAccount = async (
  context: ActionContext,
  { network, walletId, id }: { network: Network; walletId: WalletId; id: string }
) => {
  const { commit } = rootActionContext(context);
  commit.REMOVE_ACCOUNT({ network, walletId, id });
  return id;
};
