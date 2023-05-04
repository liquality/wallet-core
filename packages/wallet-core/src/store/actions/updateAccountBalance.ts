import Bluebird from 'bluebird';
import { ActionContext, rootActionContext } from '..';
import { assetsAdapter } from '../../utils/chainify';
import { AccountId, Network, WalletId } from '../types';

export const updateAccountBalance = async (
  context: ActionContext,
  { network, walletId, accountId }: { network: Network; walletId: WalletId; accountId: AccountId }
) => {
  const { state, commit, getters } = rootActionContext(context);
  const accounts =
    state.accounts[walletId]?.[network].filter((a) => a.assets && a.assets.length > 0 && a.enabled) || [];
  const index = accounts?.findIndex((a) => a.id === accountId);
  if (index >= 0) {
    const account = accounts[index];
    const { assets } = account;
    await Bluebird.map(assets, async (asset) => {
      const chainId = getters.cryptoassets[asset].chain;
      const _client = getters.client({ network, walletId, chainId, accountId });
      if (_client && _client.wallet) {
        const addresses = await _client.wallet.getUsedAddresses();

        const _assets = assetsAdapter(asset);
        const balance = addresses.length === 0 ? '0' : (await _client.chain.getBalance(addresses, _assets)).toString();

        commit.UPDATE_BALANCE({ network, accountId, walletId, asset, balance });
      }
    });
  }
};
