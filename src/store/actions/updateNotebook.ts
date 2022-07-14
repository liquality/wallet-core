import { ActionContext, rootActionContext } from '..';

export const updateNotebook = async (context: ActionContext, { address }: { address: string }): Promise<string> => {
  const { commit } = rootActionContext(context);

  commit.UPDATE_NOTEBOOK({ address });

  return address;
};
