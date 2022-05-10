import { ActionContext } from '..';

export const proxyMutation = async ({ commit }: ActionContext, { type, payload }: { type: string; payload: any }) => {
  commit(type, payload);
};
