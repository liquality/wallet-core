import { ActionContext, rootActionContext } from '..';

export const setupWallet = async (context: ActionContext, { key }: { key: string }) => {
  const { commit } = rootActionContext(context);
  commit.SETUP_WALLET({ key });
};
