import { ChainId, getChain } from '@liquality/cryptoassets';
import { CUSTOM_ERRORS, wrapCustomError } from '@liquality/error-parser';
import { AccountInfo, Network } from '../../store/types';
import { createBtcClient, createNearClient, createSolanaClient, createTerraClient } from './clients';
import { createEvmClient } from './evm';

export const createClient = (chainId: ChainId, network: Network, mnemonic: string, accountInfo: AccountInfo) => {
  const chain = getChain(network, chainId);

  if (chain.isEVM) {
    return createEvmClient(chain, mnemonic, accountInfo);
  }

  switch (chainId) {
    case ChainId.Bitcoin:
      return createBtcClient(network, mnemonic, accountInfo);
    case ChainId.Near:
      return createNearClient(network, mnemonic, accountInfo);
    case ChainId.Terra:
      return createTerraClient(network, mnemonic, accountInfo);
    case ChainId.Solana:
      return createSolanaClient(network, mnemonic, accountInfo);
    default:
      throw wrapCustomError(CUSTOM_ERRORS.NotFound.Client(chainId));
  }
};
