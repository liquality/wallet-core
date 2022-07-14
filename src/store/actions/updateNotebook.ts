import { ActionContext, rootActionContext } from '..';

export const updateNotebook = async (context: ActionContext, { address }: { address: string }): Promise<string> => {
  const { commit } = rootActionContext(context);

  // const isExisting = await HttpClient.get(`http://localhost:3000/address/${address}`);

  // if (isExisting.result) {
  commit.UPDATE_NOTEBOOK({ address });
  // }

  return address;
};
