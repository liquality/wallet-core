import { ActionContext, rootActionContext } from '..';

export const lockWallet = async (context: ActionContext) => {
  const { commit } = rootActionContext(context);
  commit.LOCK_WALLET();
};
