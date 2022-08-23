import { EVM_CHAINS } from './mainnet/EvmChains';
import { UTXO_CHAINS } from './mainnet/UtxoChains';

export const chains = { ...EVM_CHAINS, ...UTXO_CHAINS };
