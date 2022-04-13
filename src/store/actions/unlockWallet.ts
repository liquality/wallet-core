import { decrypt } from '../../utils/crypto';

export const unlockWallet = async ({ commit, state }, { key }) => {
  const wallets = await decrypt(state.encryptedWallets, key, state.keySalt);

  if (!wallets) {
    throw new Error('Try Again. Enter the right password (it has 8 or more characters).');
  }

  const parsedWallets = JSON.parse(wallets);
  commit('UNLOCK_WALLET', {
    key,
    wallets: parsedWallets,
    unlockedAt: Date.now(),
  });
};
