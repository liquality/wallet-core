import { BaseChain } from '../chains/BaseChain';
import { ChainId, Network } from '../types';
import { EVM_CHAINS } from './mainnet/EvmChains';
import { NON_EVM_CHAINS } from './mainnet/NonEvmChains';
import { UTXO_CHAINS } from './mainnet/UtxoChains';
import { TESTNET_EVM_CHAINS } from './testnet/EvmChains';
import { TESTNET_NON_EVM_CHAINS } from './testnet/NonEvmChains';
import { TESTNET_UTXO_CHAINS } from './testnet/UtxoChains';

export const MAINNET_SUPPORTED_CHAINS = { ...EVM_CHAINS, ...UTXO_CHAINS, ...NON_EVM_CHAINS } as Record<
  ChainId,
  BaseChain
>;

export const TESTNET_SUPPORTED_CHAINS = {
  ...TESTNET_EVM_CHAINS,
  ...TESTNET_UTXO_CHAINS,
  ...TESTNET_NON_EVM_CHAINS,
} as Record<ChainId, BaseChain>;

export function getChainByChainId(network: Network, chainId: ChainId) {
  const chains = getAllSupportedChains();
  return chains[network][chainId];
}

export function isEvmChain(network: Network, chainId: ChainId) {
  const chains = getAllSupportedChains();
  return chains[network][chainId].isEVM;
}

export function getAllSupportedChains() {
  return {
    mainnet: MAINNET_SUPPORTED_CHAINS,
    testnet: TESTNET_SUPPORTED_CHAINS,
  };
}

export function getAllEvmChains() {
  return {
    mainnet: EVM_CHAINS,
    testnet: TESTNET_EVM_CHAINS,
  };
}

export function getAllUtxoChains() {
  return {
    mainnet: UTXO_CHAINS,
    testnet: TESTNET_UTXO_CHAINS,
  };
}

export function getAllNonEvmChains() {
  return {
    mainnet: NON_EVM_CHAINS,
    testnet: TESTNET_NON_EVM_CHAINS,
  };
}
