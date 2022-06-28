import { Address } from '@chainify/types';
import { ChainId, chains } from '@liquality/cryptoassets';
import Bluebird from 'bluebird';
import { chunk } from 'lodash';
import { ActionContext, rootActionContext } from '..';
import { assetsAdapter } from '../../utils/chainify';
import { AccountId, Network, WalletId } from '../types';

type UpdateBalanceRequestType = {
  walletId: WalletId;
  network: Network;
  accountIds?: AccountId[];
};

export const updateBalances = async (context: ActionContext, request: UpdateBalanceRequestType) => {
  const { walletId, network } = request;
  const { state, commit, getters } = rootActionContext(context);
  const getClient = getters.client;

  let accountIds = request.accountIds;

  if (!accountIds) {
    accountIds =
      state.accounts[walletId]?.[network]?.reduce((filtered, account) => {
        if (account.enabled) {
          filtered.push(account.id);
        }
        return filtered;
      }, [] as AccountId[]) || [];
  }

  await Bluebird.map(
    // if accountIds is not passed fetch for all enabled account ids
    accountIds,
    async (accountId) => {
      const account = getters.accountItem(accountId);

      if (account) {
        const { assets, chain } = account;
        let addresses: Address[] = [];

        const nativeAsset = chains[chain].nativeAsset;
        const client = getClient({ network, walletId, asset: nativeAsset, accountId: account.id });

        addresses = await client.wallet.getUsedAddresses();

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
            const assetsChunks = chunk(chainifyAssets, 25);
            // run all balance queries concurrently
            const balances = await Promise.all(assetsChunks.map((chunk) => client.chain.getBalance(addresses, chunk)));
            // update each asset in state
            assetsChunks.forEach((assets, index) =>
              assets.forEach((asset, innerIndex) => {
                // if balance is `null` there was a problem while fetching
                const balance = balances[index][innerIndex];
                if (balance) {
                  commit.UPDATE_BALANCE({
                    network,
                    accountId: account.id,
                    walletId,
                    asset: asset.code,
                    balance: balance.toString(),
                  });
                } else {
                  console.error(`Balance not fetched: ${asset.code}`);
                }
              })
            );
          } catch (err) {
            console.info('Connected network ', client.chain.getNetwork());
            console.error(`Asset: ${nativeAsset} Balance update error:  `, err.message);
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
      }
    },
    // 7 accounts at a time
    { concurrency: 7 }
  );
};
