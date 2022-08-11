import { ChainId } from '@liquality/cryptoassets';
import { ActionContext, rootActionContext } from '../..';
import buildConfig from '../../../build.config';
import { Network, WalletId } from '../../types';

export const toggleBlockchain = async (
  context: ActionContext,
  { network, walletId, chainId, enable }: { network: Network; walletId: WalletId; chainId: ChainId; enable: boolean }
) => {
  const { commit } = rootActionContext(context);
  if (buildConfig.chains.includes(chainId)) {
    commit.TOGGLE_BLOCKCHAIN({ network, walletId, chainId, enable });
  }
};
