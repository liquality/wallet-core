import { ActionContext, rootActionContext } from '..';
import { Networks } from '../../utils/networks';
import { WalletId } from '../types';

const COMPLETED_STATES = ['SUCCESS', 'REFUNDED']; // TODO: Pull this out so it's being used everywhere else (Transaction icons etc.)

export const checkPendingActions = async (
  context: ActionContext,
  { walletId }: { walletId: WalletId }
): Promise<void> => {
  const { state, dispatch } = rootActionContext(context);
  Networks.forEach((network) => {
    const history = state.history[network]?.[walletId];
    if (!history) return;
    history.forEach((item) => {
      if (item.error) return;

      if (!COMPLETED_STATES.includes(item.status)) {
        dispatch.performNextAction({ network, walletId, id: item.id });
      }
    });
  });
};
