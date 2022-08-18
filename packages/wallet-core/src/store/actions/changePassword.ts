import { ActionContext, rootActionContext } from '..';
import { encrypt } from '../../utils/crypto';

export const changePassword = async (context: ActionContext, { key }: { key: string }) => {
  const { commit, state } = rootActionContext(context);
  const { encrypted: encryptedWallets, keySalt } = await encrypt(JSON.stringify(state.wallets), key);

  commit.CHANGE_PASSWORD({ key, keySalt, encryptedWallets });
};
