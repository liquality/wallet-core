import { ActionContext, rootActionContext } from '..';
import { Network } from '../types';

export const changeActiveNetwork = async (context: ActionContext, { network }: { network: Network }) => {
  const { commit } = rootActionContext(context);
  commit.CHANGE_ACTIVE_NETWORK({
    network,
  });
};
