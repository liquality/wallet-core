import { ActionContext, rootActionContext } from '..';

export const setWatsNewModalShowed = (context: ActionContext, { version }: { version: string }) => {
  const { commit } = rootActionContext(context);
  commit.SET_WATS_NEW_MODAL_VERSION({ version });
};
