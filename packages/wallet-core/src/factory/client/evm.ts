import { Client } from '@chainify/client';
import {
  EIP1559FeeProvider,
  EvmChainProvider,
  EvmWalletProvider,
  OptimismChainProvider,
  RpcFeeProvider,
} from '@chainify/evm';
import { EvmLedgerProvider } from '@chainify/evm-ledger';
import { Address, Network as ChainifyNetwork } from '@chainify/types';
import { JsonRpcProvider, StaticJsonRpcProvider } from '@ethersproject/providers';
import { AccountInfo, AccountType } from '../../store/types';
import { walletOptionsStore } from '../../walletOptions';
import { getNftProvider } from './nft';
import { EvmChain } from '@liquality/cryptoassets';
import { asL2Provider } from '@eth-optimism/sdk';
import { CUSTOM_ERRORS, wrapCustomError } from '@liquality/error-parser';

export function createEvmClient(chain: EvmChain, mnemonic: string, accountInfo: AccountInfo) {
  const network = chain.network;
  const chainProvider = getEvmProvider(chain);
  const walletProvider = getEvmWalletProvider(network, accountInfo, chainProvider, mnemonic);
  const client = new Client().connect(walletProvider);

  if (chain.nftProviderType) {
    const nftProvider = getNftProvider(chain.nftProviderType, walletProvider, network.isTestnet);
    client.connect(nftProvider);
  }

  return client;
}

function getEvmWalletProvider(
  network: ChainifyNetwork,
  accountInfo: AccountInfo,
  chainProvider: EvmChainProvider,
  mnemonic: string
) {
  if (accountInfo.type === AccountType.EthereumLedger || accountInfo.type === AccountType.RskLedger) {
    let addressCache;

    if (accountInfo && accountInfo.publicKey && accountInfo.address) {
      addressCache = new Address({ publicKey: accountInfo?.publicKey, address: accountInfo.address });
    }

    if (!walletOptionsStore.walletOptions.ledgerTransportCreator) {
      throw wrapCustomError(CUSTOM_ERRORS.NotFound.LedgerTransportCreator);
    }

    return new EvmLedgerProvider(
      {
        network: network,
        derivationPath: accountInfo.derivationPath,
        addressCache,
        transportCreator: walletOptionsStore.walletOptions.ledgerTransportCreator,
      },
      chainProvider
    );
  } else {
    const walletOptions = { derivationPath: accountInfo.derivationPath, mnemonic };
    return new EvmWalletProvider(walletOptions, chainProvider);
  }
}

function getEvmProvider(chain: EvmChain) {
  const network = chain.network;
  if (chain.isMultiLayered) {
    const provider = asL2Provider(new StaticJsonRpcProvider(network.rpcUrls[0], network.chainId));
    return new OptimismChainProvider(network, provider, chain.feeMultiplier);
  } else {
    const provider = new StaticJsonRpcProvider(network.rpcUrls[0], network.chainId);
    const feeProvider = getFeeProvider(chain, provider);
    return new EvmChainProvider(network, provider, feeProvider, chain.multicallSupport);
  }
}

function getFeeProvider(chain: EvmChain, provider: JsonRpcProvider) {
  if (chain.EIP1559) {
    return new EIP1559FeeProvider(provider);
  } else {
    return new RpcFeeProvider(provider, chain.feeMultiplier);
  }
}
