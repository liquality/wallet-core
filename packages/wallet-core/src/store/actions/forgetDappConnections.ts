import { ActionContext, rootActionContext } from '..';

export const forgetDappConnections = (context: ActionContext) => {
  const { commit, state } = rootActionContext(context);
  const { activeWalletId } = state;
  commit.REMOVE_EXTERNAL_CONNECTIONS({ activeWalletId });
};
