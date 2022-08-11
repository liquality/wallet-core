import { ActionContext, rootActionContext } from '..';

export const enableEthereumInjection = async (context: ActionContext) => {
  const { commit } = rootActionContext(context);
  commit.ENABLE_ETHEREUM_INJECTION();
};
