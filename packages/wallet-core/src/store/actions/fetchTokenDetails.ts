import { UnsupportedMethodError } from '@chainify/errors';
import { Nullable, TokenDetails } from '@chainify/types';
import { ChainId, chains } from '@liquality/cryptoassets';
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
  const asset = chains[chain].nativeAsset;

  const client = getters.client({ network, walletId, asset });

  try {
    return await client.chain.getTokenDetails(contractAddress);
  } catch (err) {
    if (err instanceof UnsupportedMethodError) {
      console.debug(err.message);
      return null;
    } else {
      throw err;
    }
  }
};
