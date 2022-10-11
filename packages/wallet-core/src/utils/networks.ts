import { BitcoinNetworks } from '@chainify/bitcoin';
import { NearNetworks } from '@chainify/near';
import { SolanaNetworks } from '@chainify/solana';
import { TerraNetworks } from '@chainify/terra';
import { Network as ChainifyNetwork } from '@chainify/types';
import { ChainId, getChain } from '@liquality/cryptoassets';
import { CUSTOM_ERRORS, wrapCustomError } from '@liquality/error-parser';
import { Network } from '../store/types';

export const Networks = [Network.Mainnet, Network.Testnet];

export type ChainNetworksType = Record<string, { mainnet: ChainifyNetwork; testnet: ChainifyNetwork }>;

export const ChainNetworks: ChainNetworksType = {
  [ChainId.Bitcoin]: {
    testnet: BitcoinNetworks.bitcoin_testnet,
    mainnet: BitcoinNetworks.bitcoin,
  },

  [ChainId.Near]: {
    testnet: NearNetworks.near_testnet,
    mainnet: {
      ...NearNetworks.near_mainnet,
      rpcUrl: process.env.VUE_APP_NEAR_MAINNET_URL || NearNetworks.near_mainnet.rpcUrl,
    },
  },

  [ChainId.Solana]: {
    testnet: SolanaNetworks.solana_testnet,
    mainnet: {
      ...SolanaNetworks.solana_mainnet,
      rpcUrl: process.env.VUE_APP_SOLANA_MAINNET_URL || SolanaNetworks.solana_mainnet.rpcUrl,
    },
  },

  [ChainId.Terra]: {
    testnet: {
      ...TerraNetworks.terra_testnet,
      rpcUrl: 'https://pisco-lcd.terra.dev',
      helperUrl: 'https://pisco-fcd.terra.dev',
    },
    mainnet: {
      ...TerraNetworks.terra_mainnet,
      rpcUrl: process.env.VUE_APP_TERRA_MAINNET_URL || TerraNetworks.terra_mainnet.rpcUrl,
    },
  },
};

export function getRpcUrl(chainId: ChainId, network = Network.Mainnet) {
  const rpcUrl = getChain(network, chainId).network.rpcUrls[0];
  if (!rpcUrl) {
    throw wrapCustomError(CUSTOM_ERRORS.NotFound.RPC(chainId, network));
  }
  return rpcUrl;
}
