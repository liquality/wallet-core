import { ChainId } from '@liquality/cryptoassets';
import { enableChain } from './enable_chain';

export const enableSolanaChain = {
  version: 21,
  migrate: (state: any) => enableChain(state, ChainId.Solana),
};
