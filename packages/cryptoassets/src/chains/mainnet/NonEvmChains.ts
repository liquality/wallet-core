import { IChain } from '../../interfaces/IChain';
import { ChainId } from '../../types';

import NearChain from './non-evm/near';
import SolanaChain from './non-evm/solana';
import TerraChain from './non-evm/terra';

export const NON_EVM_CHAINS: { [key in ChainId]?: IChain } = {
  [ChainId.Near]: NearChain,
  [ChainId.Solana]: SolanaChain,
  [ChainId.Terra]: TerraChain,
};
