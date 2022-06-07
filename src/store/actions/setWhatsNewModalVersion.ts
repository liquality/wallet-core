import { ActionContext, rootActionContext } from '..';

export const setWhatsNewModalVersion = (context: ActionContext, { version }: { version: string }) => {
  const { commit } = rootActionContext(context);
  commit.SET_WHATS_NEW_MODAL_VERSION({ version });
};
