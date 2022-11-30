import { ActionContext, rootActionContext } from '..';

export const clearErrorLog = (context: ActionContext) => {
  const { commit } = rootActionContext(context);
  commit.CLEAR_ERROR_LOG();
};
