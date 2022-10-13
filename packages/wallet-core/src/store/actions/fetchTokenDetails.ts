import { UnsupportedMethodError } from '@chainify/errors';
import { Nullable, TokenDetails } from '@chainify/types';
import { ChainId } from '@liquality/cryptoassets';
import { LiqualityError } from '@liquality/error-parser';
import { ActionContext, rootActionContext } from '..';
import { Network, WalletId } from '../types';

export type FetchTokenDetailsRequest = {
  walletId: WalletId;
  network: Network;
  chain: ChainId;
  contractAddress: string;
};

export const fetchTokenDetails = async (
  context: ActionContext,
  tokenDetailsRequest: FetchTokenDetailsRequest
): Promise<Nullable<TokenDetails>> => {
  const { walletId, network, chain, contractAddress } = tokenDetailsRequest;
  const { getters } = rootActionContext(context);
  const client = getters.client({ network, walletId, chainId: chain });

  try {
    return await client.chain.getTokenDetails(contractAddress);
  } catch (err) {
    if ((err as LiqualityError).rawError instanceof UnsupportedMethodError) {
      return null;
    }
    throw err;
  }
};
