import { ChainId, getChainByChainId } from '@liquality/cryptoassets';
import { ActionContext, rootActionContext } from '..';
import { AccountId, Network, WalletId } from '../types';

export const exportPrivateKey = async (
  context: ActionContext,
  {
    network,
    walletId,
    accountId,
    chainId,
  }: { network: Network; walletId: WalletId; accountId: AccountId; chainId: ChainId }
): Promise<string> => {
  const { getters } = rootActionContext(context);

  const asset = getChainByChainId(network, chainId).nativeAsset[0].code;
  if (!asset) {
    throw new Error(`missing nativeAsset for ${chainId}`);
  }

  const client = getters.client({
    network,
    walletId,
    accountId,
    asset,
  });

  return client.wallet.exportPrivateKey();
};
