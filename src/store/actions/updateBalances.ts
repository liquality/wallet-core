import { Address } from '@chainify/types';
import { ChainId, chains } from '@liquality/cryptoassets';
import Bluebird from 'bluebird';
import { ActionContext, rootActionContext } from '..';
import { chunkArray } from '../../utils/arrays';
import { assetsAdapter } from '../../utils/chainify';
import { Asset, Network } from '../types';

export const updateBalances = async (
  context: ActionContext,
  { network, walletId, assets }: { network: Network; walletId: string; assets: Asset[] }
): Promise<void> => {
  const { state, commit, getters } = rootActionContext(context);

  // filter accounts for all enabled assets
  let accounts = state.accounts[walletId]?.[network].filter((a) => a.assets && a.assets.length > 0 && a.enabled);

  if (!accounts) {
    return;
  }

  if (assets && assets.length > 0) {
    // filter accounts for a match between all enabled assets and requested ones
    accounts = accounts.filter((a) => a.assets.some((s) => assets.includes(s)));
  }
  const getClient = getters.client;

  await Bluebird.map(
    accounts,
    async (account) => {
      const { assets, type, chain } = account;
      let addresses: Address[] = [];

      const nativeAsset = chains[chain].nativeAsset;
      const client = getClient({ network, walletId, asset: nativeAsset, accountId: account.id });

      if (type.includes('ledger')) {
        addresses = account.addresses
          .filter((a) => typeof a === 'string')
          .map((address) => {
            return new Address({
              address: `${address}`,
            });
          });
      } else {
        addresses = await client.wallet.getUsedAddresses();
      }

      // if there are no addresses set balance to 0
      if (addresses.length === 0) {
        assets.forEach((a) =>
          commit.UPDATE_BALANCE({ network, accountId: account.id, walletId, asset: a, balance: '0' })
        );
      }
      // fetch balances
      else {
        try {
          const chainifyAssets = assetsAdapter(assets);
          // split into chunks of 25 to avoid gas limitations of static calls
          const assetsChunks = chunkArray(chainifyAssets, 25);
          // run all balance queries concurrently
          const balances = await Promise.all(assetsChunks.map((chunk) => client.chain.getBalance(addresses, chunk)));
          // update each asset in state
          assetsChunks.forEach((assets, index) =>
            assets.forEach((asset, innerIndex) => {
              commit.UPDATE_BALANCE({
                network,
                accountId: account.id,
                walletId,
                asset: asset.code,
                balance: balances[index][innerIndex].toString(),
              });
            })
          );
        } catch (err) {
          console.error(`Asset: ${nativeAsset} Balance update error:  `, err.message);
          console.info('Connected network ', client.chain.getNetwork());
        }
      }

      let updatedAddresses: string[] = [];
      if (account.chain === ChainId.Bitcoin) {
        const addressExists = addresses.some((a) => account.addresses.includes(a.toString()));
        if (!addressExists) {
          updatedAddresses = [...account.addresses, ...addresses.map((a) => a.toString())];
        } else {
          updatedAddresses = [...account.addresses];
        }
      } else {
        updatedAddresses = [...addresses.map((a) => a.toString())];
      }

      commit.UPDATE_ACCOUNT_ADDRESSES({
        network,
        accountId: account.id,
        walletId,
        addresses: updatedAddresses,
      });
    },
    { concurrency: 5 }
  );
};
