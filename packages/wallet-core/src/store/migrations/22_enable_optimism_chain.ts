import { ChainId } from '@liquality/cryptoassets';
import { enableChain } from './enable_chain';

export const enableOptimismChain = {
  version: 22,
  migrate: (state: any) => enableChain(state, ChainId.Optimism),
};
