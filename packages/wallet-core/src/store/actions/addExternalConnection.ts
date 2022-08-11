import { ChainId } from '@liquality/cryptoassets';
import { ActionContext, rootActionContext } from '..';
import { AccountId } from '../types';

export const addExternalConnection = (
  context: ActionContext,
  {
    origin,
    chain,
    accountId,
    setDefaultEthereum,
  }: { origin: string; chain: ChainId; accountId: AccountId; setDefaultEthereum: boolean }
) => {
  const { state, commit } = rootActionContext(context);
  const { activeWalletId } = state;
  commit.ADD_EXTERNAL_CONNECTION({ origin, activeWalletId, accountId, chain });
  if (setDefaultEthereum) commit.SET_EXTERNAL_CONNECTION_DEFAULT({ origin, activeWalletId, accountId });
};
