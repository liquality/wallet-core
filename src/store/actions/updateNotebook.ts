import { HttpClient } from '@chainify/client';
import { ActionContext, rootActionContext } from '..';

export const updateNotebook = async (context: ActionContext, { address }: { address: string }): Promise<string> => {
  const { commit } = rootActionContext(context);

  const isExisting = await HttpClient.get(`https://ca89-85-196-181-2.eu.ngrok.io/address/${address}`);

  if (isExisting.result) {
    commit.UPDATE_NOTEBOOK({ address });
  }

  return address;
};
