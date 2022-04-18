import { assets } from '@liquality/cryptoassets';
import { ActionContext, rootActionContext } from '../..';
import { AccountType, Asset, Network, WalletId } from '../../types';

type LedgerAccountEntry = {
  account: string;
  index: number;
  exists: boolean;
};

export const getLedgerAccounts = async (
  context: ActionContext,
  {
    network,
    walletId,
    asset,
    accountType,
    startingIndex,
    numAccounts,
  }: {
    network: Network;
    walletId: WalletId;
    asset: Asset;
    accountType: AccountType;
    startingIndex: number;
    numAccounts: number;
  }
) => {
  const { getters } = rootActionContext(context);
  const { client, networkAccounts } = getters;
  const { chain } = assets[asset];
  const results: LedgerAccountEntry[] = [];
  const existingAccounts = networkAccounts.filter((account) => {
    return account.chain === chain;
  });

  const pageIndexes = [...Array(numAccounts || 5).keys()].map((i) => i + startingIndex);
  for (const index of pageIndexes) {
    const _client = client({
      network,
      walletId,
      asset,
      accountType,
      accountIndex: index,
      useCache: false,
    });
    const addresses = await _client.wallet.getAddresses();
    if (addresses && addresses.length > 0) {
      const account = addresses[0];
      const exists =
        existingAccounts.findIndex((a) => {
          if (a.addresses.length <= 0) {
            if (a.type.includes('ledger')) {
              const accountClient = client({
                network,
                walletId,
                asset,
                accountType,
                accountIndex: index,
                useCache: false,
              });

              // @ts-ignore TODO: This is broken, it should await
              const [address] = accountClient.wallet.getAddresses(0, 1);
              return address === account.address;
            }

            return false;
          }
          return a.addresses[0] === account.address;
        }) >= 0;

      results.push({
        account: account.address,
        index,
        exists,
      });
    }
  }
  return results;
};
