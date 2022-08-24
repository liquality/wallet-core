import { BitcoinLedgerProvider } from '@chainify/bitcoin-ledger';
import { AssetTypes, ChainId, getAllAssets, getChainByChainId } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { ActionContext, rootActionContext } from '../..';
import { getDerivationPath } from '../../../utils/derivationPath';
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
  const { client, networkAccounts, assetFiatBalance } = getters;
  const allAssets = getAllAssets();
  const { chain } = allAssets[network][asset];

  const chainifyAsset = {
    ...allAssets[network][asset],
    isNative: allAssets[network][asset].type === AssetTypes.native,
  };

  const results: LedgerAccountEntry[] = [];
  const existingAccounts = networkAccounts.filter((account) => {
    return account.chain === chain;
  });

  const pageIndexes = [...Array(numAccounts || 5).keys()].map((i) => i + startingIndex);
  for (const index of pageIndexes) {
    const derivationPath = getDerivationPath(chain, network, index, accountType);
    let _chainCode = null;
    let _publicKey = null;

    const _client = client({ network, walletId, chainId: chain, accountType, accountIndex: index, useCache: false });

    // we need to get the chain code and public key for btc
    if (chain === ChainId.Bitcoin) {
      const btcAccount = await (_client.wallet as BitcoinLedgerProvider).getWalletPublicKey(derivationPath);
      _chainCode = btcAccount.chainCode;
      _publicKey = btcAccount.publicKey;
    }

    const addresses = await _client.wallet.getAddresses();
    if (addresses && addresses.length > 0) {
      const [account] = addresses;
      const normalizedAddress = getChainByChainId(network, chain).formatAddress(account.address);

      // verify if the account exists
      const existingIndex = existingAccounts.findIndex((a) => {
        const addresses = a.addresses.map((a) => getChainByChainId(network, chain).formatAddress(a));
        return addresses.includes(normalizedAddress);
      });
      const exists = existingIndex >= 0;

      // Get the account balance
      const balance = addresses.length === 0 ? 0 : (await _client.chain.getBalance(addresses, [chainifyAsset]))[0];
      const fiatBalance = assetFiatBalance(asset, balance as BN) || new BN(0);
      const result = {
        account: normalizedAddress,
        balance,
        fiatBalance,
        index,
        exists,
        chainCode: _chainCode,
        publicKey: _publicKey || account.publicKey,
        derivationPath,
      };
      results.push(result);
    }
  }
  return results;
};
