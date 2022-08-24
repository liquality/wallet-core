import { IChain } from '../../interfaces/IChain';
import { ChainId } from '../../types';

import BitcoinChain from './utxo/bitcoin';

export const TESTNET_UTXO_CHAINS: { [key in ChainId]?: IChain } = {
  [ChainId.Bitcoin]: BitcoinChain,
};
