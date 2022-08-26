import { ChainId, ChainsMap } from '../../types';

import NearChain from './non-evm/near';
import SolanaChain from './non-evm/solana';
import TerraChain from './non-evm/terra';

export const TESTNET_NON_EVM_CHAINS: ChainsMap = {
  [ChainId.Near]: NearChain,
  [ChainId.Solana]: SolanaChain,
  [ChainId.Terra]: TerraChain,
};
