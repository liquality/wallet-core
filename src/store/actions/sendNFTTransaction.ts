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
  }: // data,
  // fee,
  {
    network: Network;
    walletId: WalletId;
    contract: Address | string;
    receiver: string;
    tokenIDs: number[];
    values: number[];
    // data: string;
    // fee: number;
  }
): Promise<any> => {
  const { getters } = rootActionContext(context);
  const client = getters.client({
    network,
    walletId,
    asset: 'ETH',
  });

  console.log('🚀 ~ file: sendNFTTransaction.ts ~ line 35 ~ values', values);
  console.log('🚀 ~ file: sendNFTTransaction.ts ~ line 35 ~ tokenIDs', tokenIDs);
  console.log('🚀 ~ file: sendNFTTransaction.ts ~ line 35 ~ receiver', receiver);
  console.log('🚀 ~ file: sendNFTTransaction.ts ~ line 35 ~ contract', contract);
  // try {
  const response = await client.nft.transfer(contract, receiver, tokenIDs, values);
  console.log('🚀 ~ file: sendNFT.js ~ line 10 ~ sendNFT ~ response', response);
  return response;
  // } catch (error) {
  //   return error;
  // }
};
