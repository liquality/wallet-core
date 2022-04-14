import { ChainId } from '@liquality/cryptoassets';
import { Address } from '@liquality/types';
import Bluebird from 'bluebird';
import { rootActionContext } from '..';
import { Asset, Network } from '../types';

export const updateBalances = async (
  context,
  { network, walletId, assets }: { network: Network; walletId: string; assets: Asset[] }
) => {
  const { state, commit, getters } = rootActionContext(context);
  let accounts = state.accounts[walletId]?.[network].filter((a) => a.assets && a.assets.length > 0 && a.enabled);

  if (!accounts) return;

  if (assets && assets.length > 0) {
    accounts = accounts.filter((a) => a.assets.some((s) => assets.includes(s)));
  }
  const client = getters.client;

  await Bluebird.map(
    accounts,
    async (account) => {
      const { assets, type } = account;
      await Bluebird.map(
        assets,
        async (asset) => {
          let addresses: Address[] = [];
          const _client = client({
            network,
            walletId,
            asset,
            accountId: account.id,
          });

          if (type.includes('ledger')) {
            addresses = account.addresses
              .filter((a) => typeof a === 'string')
              .map((address) => {
                return new Address({
                  address: `${address}`,
                });
              });
          } else {
            addresses = await _client.wallet.getUsedAddresses();
          }

          try {
            const balance = addresses.length === 0 ? '0' : (await _client.chain.getBalance(addresses)).toString();

            commit.UPDATE_BALANCE({
              network,
              accountId: account.id,
              walletId,
              asset,
              balance,
            });
          } catch (err) {
            console.error(err);
          }

          // Commit to the state the addresses
          let updatedAddresses: string[] = [];
          if (account.chain === ChainId.Bitcoin) {
            const addressExists = addresses.some((a) => account.addresses.includes(a.address));
            if (!addressExists) {
              updatedAddresses = [...account.addresses, ...addresses.map((a) => a.address)];
            } else {
              updatedAddresses = [...account.addresses];
            }
          } else {
            updatedAddresses = [...addresses.map((a) => a.address)];
          }

          commit.UPDATE_ACCOUNT_ADDRESSES({
            network,
            accountId: account.id,
            walletId,
            addresses: updatedAddresses,
          });
        },
        { concurrency: 1 }
      );
    },
    { concurrency: 1 }
  );
};
