import { ActionContext, rootActionContext } from '../..';
import { accountCreator } from '../../../utils/accounts';
import { Account, Network, WalletId } from '../../types';

export const createAccount = async (
  context: ActionContext,
  { walletId, network, account }: { walletId: WalletId; network: Network; account: Account }
) => {
  const { commit, dispatch } = rootActionContext(context);
  const _account = accountCreator({ network, walletId, account });

  commit.CREATE_ACCOUNT({ network, walletId, account: _account });

  if (!account.addresses || account.addresses.length <= 0) {
    await dispatch.getUnusedAddresses({
      network,
      walletId,
      assets: _account.assets,
      accountId: _account.id,
    });
  }
  await dispatch.updateAccountBalance({
    network,
    walletId,
    accountId: _account.id,
  });

  return _account;
};
