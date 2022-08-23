import { EVM_CHAINS } from './mainnet/EvmChains';
import { NON_EVM_CHAINS } from './mainnet/NonEvmChains';
import { UTXO_CHAINS } from './mainnet/UtxoChains';

export const MAINNET_SUPPORTED_CHAINS = { ...EVM_CHAINS, ...UTXO_CHAINS, ...NON_EVM_CHAINS };
export const TESTNET_SUPPORTED_CHAINS = null;

export function getAllSupportedChains() {
  return {
    mainnet: MAINNET_SUPPORTED_CHAINS,
    testnet: TESTNET_SUPPORTED_CHAINS,
  };
}

export function getAllEvmChains() {
  return {
    mainnet: EVM_CHAINS,
    testnet: null,
  };
}

export function getAllUtxoChains() {
  return {
    mainnet: UTXO_CHAINS,
    testnet: null,
  };
}

export function getAllNonEvmChains() {
  return {
    mainnet: NON_EVM_CHAINS,
    testnet: null,
  };
}
