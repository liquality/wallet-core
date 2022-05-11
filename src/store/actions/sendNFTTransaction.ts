import { Address } from '@liquality/types';
import { ActionContext, rootActionContext } from '..';
import { Network, WalletId } from '../types';

export const sendNFTTransaction = async (
  context: ActionContext,
  {
    network,
    walletId,
    contract,
    receiver,
    tokenIDs,
    values,
    data,
  }: // fee,
  {
    network: Network;
    walletId: WalletId;
    contract: Address | string;
    receiver: string;
    tokenIDs: number[];
    values: number[];
    data: string;
    // fee: number;
  }
): Promise<any> => {
  const { getters } = rootActionContext(context);
  const client = getters.client({
    network,
    walletId,
    asset: 'ETH',
  });

  const nft = await client.nft.transfer(contract, receiver, tokenIDs, values, data);
  console.log('🚀 ~ file: sendNFT.js ~ line 10 ~ sendNFT ~ nft', nft);
};
