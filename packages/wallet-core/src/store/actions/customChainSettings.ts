import { ActionContext, rootActionContext } from '..';
import { ChainId } from '@liquality/cryptoassets';
import { Network as ChainifyNetwork } from '@chainify/types';
import { WalletId, Network } from '../types';
import { clientCache } from '../utils';

export const saveCustomChainSettings = (
  context: ActionContext,
  {
    network,
    walletId,
    chainId,
    chanifyNetwork,
  }: { network: Network; walletId: WalletId; chainId: ChainId; chanifyNetwork: ChainifyNetwork }
) => {
  const { commit } = rootActionContext(context);
  commit.SET_CUSTOM_CHAIN_SETTINGS({
    network,
    walletId,
    chainId,
    chanifyNetwork,
  });
  clearClientCache({ network, walletId, chainId });
};

export const removeCustomChainSettings = (
  context: ActionContext,
  { network, walletId, chainId }: { network: Network; walletId: WalletId; chainId: ChainId }
) => {
  const { commit } = rootActionContext(context);
  commit.REMOVE_CUSTOM_CHAIN_SETTINGS({
    network,
    walletId,
    chainId,
  });
  clearClientCache({ network, walletId, chainId });
};

const clearClientCache = ({
  network,
  walletId,
  chainId,
}: {
  network: Network;
  walletId: WalletId;
  chainId: ChainId;
}) => {
  const cacheKey = [chainId, network, walletId].join('-');

  Object.keys(clientCache)
    .filter((k) => k.startsWith(cacheKey))
    .forEach((k) => {
      if (clientCache[k]) {
        delete clientCache[k];
      }
    });
};
