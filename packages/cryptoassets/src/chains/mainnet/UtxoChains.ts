import { ChainId, ChainsMap } from '../../types';

import BitcoinChain from './utxo/bitcoin';

export const UTXO_CHAINS: ChainsMap = {
  [ChainId.Bitcoin]: BitcoinChain,
};
