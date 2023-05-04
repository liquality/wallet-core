import { Client } from '@chainify/client';
import { EvmChainProvider, EvmTypes } from '@chainify/evm';
import { Address, AddressType, BigNumber } from '@chainify/types';
import { ChainId, getChain } from '@liquality/cryptoassets';
import Bluebird from 'bluebird';
import { chunk } from 'lodash';
import { ActionContext, rootActionContext } from '..';
import { assetsAdapter } from '../../utils/chainify';
import { Account, AccountId, Network, WalletId } from '../types';

type UpdateBalanceRequestType = {
  walletId: WalletId;
  network: Network;
  accountIds?: AccountId[];
};

type EvmAccountsMap = Record<ChainId, Array<Account>>;

export const updateBalances = async (context: ActionContext, request: UpdateBalanceRequestType) => {
  const { walletId, network } = request;
  const { state, commit, getters } = rootActionContext(context);
  const accounts = state.accounts[walletId]?.[network];

  if (accounts) {
    const accountIds =
      request.accountIds ||
      // get all enabled account ids if none are requested
      accounts.reduce((filtered, account) => {
        if (account.enabled) {
          filtered.push(account.id);
        }
        return filtered;
      }, [] as AccountId[]);

    // Update EVM Balances with multicall enabled
    const evmAccounts = getEvmAccountsWithMulticalEnabled(context, accountIds, network, walletId);
    updateEVMBalances(context, evmAccounts, network, walletId);

    await Bluebird.map(
      accountIds,
      async (accountId) => {
        const account = accounts.find((a) => a.id === accountId);

        // skip all EVM chains, because they are handled in a different way (multicall for all accounts & assets)
        if (account && !evmAccounts[account.chain]) {
          const { assets, chain } = account;

          const client = getters.client({ network, walletId, chainId: chain, accountId: account.id });

          const addresses: Address[] = await client.wallet.getUsedAddresses();
          updateAccountAddresses(context, account, addresses, network, walletId);

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
              const balances = await Promise.all(
                assetsChunks.map((chunk) => client.chain.getBalance(addresses, chunk))
              );
              // update each asset in state
              assetsChunks.forEach((_assets, index) =>
                _assets.forEach((asset, innerIndex) => {
                  // if balance is `null` there was a problem while fetching
                  const balance = balances[index][innerIndex];
                  if (balance) {
                    commit.UPDATE_BALANCE({
                      network,
                      accountId: account.id,
                      walletId,
                      asset: assets[innerIndex],
                      balance: balance.toString(),
                    });
                  } else {
                    console.debug(`Balance not fetched: ${asset.code}`);
                  }
                })
              );
            } catch (err) {
              console.debug('Connected network ', client.chain.getNetwork());
              console.debug(`Chain: ${chain} Balance update error:  `, err.message);
            }
          }
        }
      },
      // 5 accounts at a time
      { concurrency: 5 }
    ).catch((error) => {
      console.debug(`Bluebird failed: ${JSON.stringify(error)}`);
    });
  }
};

const updateAccountAddresses = (
  context: ActionContext,
  account: Account,
  addresses: AddressType[],
  network: Network,
  walletId: WalletId
) => {
  const { commit } = rootActionContext(context);
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
};

const getEvmAccountsWithMulticalEnabled = (
  context: ActionContext,
  accountIds: string[],
  network: Network,
  walletId: WalletId
) => {
  const { getters } = rootActionContext(context);

  return accountIds.reduce((result, a) => {
    const acc = getters.accountItem(a);
    if (acc) {
      const chain = getChain(network, acc.chain);
      if (chain.isEVM) {
        const client = getters.client({
          network,
          walletId,
          chainId: acc.chain,
          accountId: a,
        }) as Client<EvmChainProvider>;

        // add only EVM chains that has multicall support
        if (client.chain.multicall) {
          if (!result[acc.chain]) {
            result[acc.chain] = [];
          }
          result[acc.chain].push(acc);
        }
      }
    }

    return result;
  }, {} as EvmAccountsMap);
};

const updateEVMBalances = async (
  context: ActionContext,
  evmAccounts: EvmAccountsMap,
  network: Network,
  walletId: WalletId
) => {
  const { getters, commit } = rootActionContext(context);

  await Bluebird.map(
    Object.entries(evmAccounts),
    async ([chain, accounts]) => {
      // each account for each chain can be used to get a chainify client
      const evmAccount = accounts[0];

      // common evm client
      const client = getters.client({
        network,
        walletId,
        chainId: chain as ChainId,
        accountId: evmAccount.id,
      }) as Client<EvmChainProvider>;

      // fetch the address for all accounts
      const addressesForAllAccounts = await Promise.all(
        accounts.map((a) => {
          return getters
            .client({
              network,
              walletId,
              chainId: a.chain,
              accountId: a.id,
            })
            .wallet.getUsedAddresses();
        })
      );

      // update address for each account
      accounts.map((acc, index) => {
        updateAccountAddresses(context, acc, addressesForAllAccounts[index], network, walletId);
      });

      const multicallCallData = accounts.reduce((result, a, index) => {
        // evm accounts have only 1 address
        const user = addressesForAllAccounts[index][0].toString();

        a.assets.forEach((asset) => {
          const chainifyAsset = assetsAdapter(asset)[0];
          const callData = client.chain.multicall.buildBalanceCallData(chainifyAsset, user);
          result.push(callData);
        });

        return result;
      }, [] as EvmTypes.MulticallData[]);

      const result = await client.chain.multicall.multicall<BigNumber[]>(multicallCallData);

      accounts.forEach((acc) => {
        const balances = result.splice(0, acc.assets.length).map((balance, index) => {
          if (balance) {
            return balance.toString();
          } else {
            console.debug(`Balance not fetched: ${acc.assets[index]}`);
            return null;
          }
        });

        commit.UPDATE_MULTIPLE_BALANCES({
          network,
          accountId: acc.id,
          walletId,
          assets: acc.assets,
          balances,
        });
      });
    },
    // 5 EVM chains
    { concurrency: 5 }
  ).catch((error) => {
    console.debug(`Bluebird EVM Balances failed: ${JSON.stringify(error)}`);
  });
};
