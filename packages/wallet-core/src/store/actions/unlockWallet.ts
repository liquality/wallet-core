import { PasswordError } from '@liquality/error-parser';
import { ActionContext, rootActionContext } from '..';
import { decrypt } from '../../utils/crypto';

export const unlockWallet = async (context: ActionContext, { key }: { key: string }) => {
  const { commit, state } = rootActionContext(context);
  const wallets = await decrypt(state.encryptedWallets, key, state.keySalt);

  if (!wallets) {
    throw new PasswordError();
  }

  const parsedWallets = JSON.parse(wallets);
  commit.UNLOCK_WALLET({
    key,
    wallets: parsedWallets,
    unlockedAt: Date.now(),
  });
};
