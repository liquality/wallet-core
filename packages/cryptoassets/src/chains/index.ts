import { EVM_CHAINS } from './mainnet/EvmChains';
import { NON_EVM_CHAINS } from './mainnet/NonEvmChains';
import { UTXO_CHAINS } from './mainnet/UtxoChains';

export const MAINNET_SUPPORTED_CHAINS = { ...EVM_CHAINS, ...UTXO_CHAINS, ...NON_EVM_CHAINS };
