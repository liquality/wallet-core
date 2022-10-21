import { Client } from '@chainify/client';
import {
  BitcoinEsploraApiProvider,
  BitcoinFeeApiProvider,
  BitcoinHDWalletProvider,
  BitcoinSwapEsploraProvider,
  BitcoinTypes,
} from '@chainify/bitcoin';
import { BitcoinLedgerProvider } from '@chainify/bitcoin-ledger';

import { NearChainProvider, NearSwapProvider, NearTypes, NearWalletProvider } from '@chainify/near';
import { SolanaChainProvider, SolanaNftProvider, SolanaWalletProvider } from '@chainify/solana';
import { TerraChainProvider, TerraSwapProvider, TerraTypes, TerraWalletProvider } from '@chainify/terra';

import buildConfig from '../../build.config';
import { AccountInfo, Network } from '../../store/types';
import { LEDGER_BITCOIN_OPTIONS } from '../../utils/ledger';
import { ChainNetworks } from '../../utils/networks';
import { walletOptionsStore } from '../../walletOptions';
import { CUSTOM_ERRORS, createInternalError } from '@liquality/error-parser';

export function createBtcClient(network: Network, mnemonic: string, accountInfo: AccountInfo) {
  const isMainnet = network === 'mainnet';
  const bitcoinNetwork = ChainNetworks.bitcoin[network] as BitcoinTypes.BitcoinNetwork;
  const esploraApi = buildConfig.exploraApis[network];
  const batchEsploraApi = buildConfig.batchEsploraApis[network];

  const chainProvider = new BitcoinEsploraApiProvider({
    batchUrl: batchEsploraApi,
    url: esploraApi,
    network: bitcoinNetwork,
    numberOfBlockConfirmation: 2,
  });

  if (isMainnet) {
    const feeProvider = new BitcoinFeeApiProvider('https://liquality.io/swap/mempool/v1/fees/recommended');
    chainProvider.setFeeProvider(feeProvider);
  }

  const swapProvider = new BitcoinSwapEsploraProvider({
    network: bitcoinNetwork,
    scraperUrl: esploraApi,
  });

  // TODO: make sure Ledger works
  if (accountInfo.type.includes('bitcoin_ledger')) {
    const option = LEDGER_BITCOIN_OPTIONS.find((o) => o.name === accountInfo.type);
    if (!option) {
      throw createInternalError(CUSTOM_ERRORS.NotFound.AccountTypeOption(accountInfo.type));
    }
    const { addressType } = option;
    if (!walletOptionsStore.walletOptions.ledgerTransportCreator) {
      throw createInternalError(CUSTOM_ERRORS.NotFound.LedgerTransportCreator);
    }
    const ledgerProvider = new BitcoinLedgerProvider(
      {
        network: bitcoinNetwork,
        addressType,
        baseDerivationPath: accountInfo.derivationPath,
        basePublicKey: accountInfo?.publicKey,
        baseChainCode: accountInfo?.chainCode,
        transportCreator: walletOptionsStore.walletOptions.ledgerTransportCreator,
      },
      chainProvider
    );
    swapProvider.setWallet(ledgerProvider);
  } else {
    const walletOptions = {
      network: bitcoinNetwork,
      baseDerivationPath: accountInfo.derivationPath,
      mnemonic,
    };
    const walletProvider = new BitcoinHDWalletProvider(walletOptions, chainProvider);
    swapProvider.setWallet(walletProvider);
  }

  return new Client().connect(swapProvider);
}

export function createNearClient(network: Network, mnemonic: string, accountInfo: AccountInfo) {
  const nearNetwork = ChainNetworks.near[network] as NearTypes.NearNetwork;
  const walletOptions = { mnemonic, derivationPath: accountInfo.derivationPath, helperUrl: nearNetwork.helperUrl };
  const chainProvider = new NearChainProvider(nearNetwork);
  const walletProvider = new NearWalletProvider(walletOptions, chainProvider);
  const swapProvider = new NearSwapProvider(nearNetwork.helperUrl, walletProvider);
  return new Client().connect(swapProvider);
}

export function createTerraClient(network: Network, mnemonic: string, accountInfo: AccountInfo) {
  const terraNetwork = ChainNetworks.terra[network] as TerraTypes.TerraNetwork;
  const { helperUrl } = terraNetwork;
  const walletOptions = { mnemonic, derivationPath: accountInfo.derivationPath, helperUrl };
  const chainProvider = new TerraChainProvider(terraNetwork);
  const walletProvider = new TerraWalletProvider(walletOptions, chainProvider);
  const swapProvider = new TerraSwapProvider(helperUrl, walletProvider);
  return new Client().connect(swapProvider);
}

export function createSolanaClient(network: Network, mnemonic: string, accountInfo: AccountInfo) {
  const solanaNetwork = ChainNetworks.solana[network];
  const walletOptions = { mnemonic, derivationPath: accountInfo.derivationPath };
  const chainProvider = new SolanaChainProvider(solanaNetwork);
  const walletProvider = new SolanaWalletProvider(walletOptions, chainProvider);
  const nftProvider = new SolanaNftProvider(walletProvider as any, {
    url: 'https://tjgwcry8a7dd.usemoralis.com:2053/server',
    appId: 'PwWfldBBlRaVWGihW4K6LqL4AQbmVNTI3w2OyDhN',
    apiKey: 'X9Bg0wQh5rzvbZ3owmtqAsxdMTy3L81jnz6BNVsj',
  });

  return new Client().connect(walletProvider).connect(nftProvider);
}
