import { ActionContext, rootActionContext } from '..';

export const disableEthereumInjection = async (context: ActionContext) => {
  const { commit } = rootActionContext(context);
  commit.DISABLE_ETHEREUM_INJECTION();
};
