import {
  BitcoinEsploraApiProvider,
  BitcoinFeeApiProvider,
  BitcoinHDWalletProvider,
  BitcoinSwapEsploraProvider,
} from '@chainify/bitcoin';
import { Client, Fee } from '@chainify/client';
import { EvmChainProvider, EvmSwapProvider, EvmWalletProvider } from '@chainify/evm';
import { NearChainProvider, NearSwapProvider, NearTypes, NearWalletProvider } from '@chainify/near';
import { SolanaChainProvider, SolanaWalletProvider } from '@chainify/solana';
import { TerraChainProvider, TerraSwapProvider, TerraTypes, TerraWalletProvider } from '@chainify/terra';
import { Network as ChainifyNetwork, Nullable } from '@chainify/types';
import { ChainId } from '@liquality/cryptoassets';
import buildConfig from '../../build.config';
import { Account, AccountType, Asset, Network } from '../../store/types';
import { HTLC_CONTRACT_ADDRESS } from '../../utils/chainify';
import cryptoassets from '../../utils/cryptoassets';
import { LEDGER_BITCOIN_OPTIONS } from '../../utils/ledger';
import { ChainNetworks } from '../../utils/networks';
import { walletOptionsStore } from '../../walletOptions';

export function createBtcClient(
  network: Network,
  mnemonic: string,
  accountType: AccountType,
  baseDerivationPath: string,
  account?: Nullable<Account>
) {
  const isMainnet = network === 'mainnet';
  const bitcoinNetwork = ChainNetworks.bitcoin[network];
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
  if (accountType.includes('bitcoin_ledger')) {
    const option = LEDGER_BITCOIN_OPTIONS.find((o) => o.name === accountType);
    if (!option) {
      throw new Error(`Account type ${accountType} not an option`);
    }
    const { addressType } = option;
    if (!walletOptionsStore.walletOptions.createBitcoinLedgerProvider) {
      throw new Error('Wallet Options: createBitcoinLedgerProvider is not defined - unable to build ledger client');
    }
    const ledgerProvider = walletOptionsStore.walletOptions.createBitcoinLedgerProvider(
      network,
      bitcoinNetwork,
      addressType,
      baseDerivationPath,
      account?.publicKey,
      account?.chainCode
    );
    swapProvider.setWallet(ledgerProvider);
  } else {
    const walletOptions = {
      network: bitcoinNetwork,
      baseDerivationPath,
      mnemonic,
    };
    const walletProvider = new BitcoinHDWalletProvider(walletOptions, chainProvider);
    swapProvider.setWallet(walletProvider);
  }

  return new Client().connect(swapProvider);
}

export function createEVMClient(
  asset: Asset,
  network: Network,
  ethereumNetwork: ChainifyNetwork,
  feeProvider: Fee,
  mnemonic: string,
  accountType: AccountType,
  derivationPath: string
) {
  const chainProvider = new EvmChainProvider(ethereumNetwork, undefined, feeProvider);
  const swapProvider = new EvmSwapProvider({ contractAddress: HTLC_CONTRACT_ADDRESS });

  if (accountType === AccountType.EthereumLedger || accountType === AccountType.RskLedger) {
    const assetData = cryptoassets[asset];
    const chainId = assetData.chain || ChainId.Ethereum;
    if (!walletOptionsStore.walletOptions.createEthereumLedgerProvider) {
      throw new Error('Wallet Options: createEthereumLedgerProvider is not defined - unable to build ledger client');
    }
    const ledgerProvider = walletOptionsStore.walletOptions.createEthereumLedgerProvider(
      network,
      ethereumNetwork,
      chainId,
      derivationPath
    );
    swapProvider.setWallet(ledgerProvider);
  } else {
    const walletOptions = { derivationPath, mnemonic };
    const walletProvider = new EvmWalletProvider(walletOptions, chainProvider);
    swapProvider.setWallet(walletProvider);
  }

  return new Client().connect(swapProvider);
}

export function createNearClient(network: Network, mnemonic: string, derivationPath: string) {
  const nearNetwork = ChainNetworks.near[network] as NearTypes.NearNetwork;
  const walletOptions = { mnemonic, derivationPath, helperUrl: nearNetwork.helperUrl };
  const chainProvider = new NearChainProvider(nearNetwork);
  const walletProvider = new NearWalletProvider(walletOptions, chainProvider);
  const swapProvider = new NearSwapProvider(nearNetwork.helperUrl, walletProvider);
  return new Client().connect(swapProvider);
}

export function createTerraClient(network: Network, mnemonic: string, derivationPath: string) {
  const terraNetwork = ChainNetworks.terra[network] as TerraTypes.TerraNetwork;
  const { helperUrl } = terraNetwork;
  const walletOptions = { mnemonic, derivationPath, helperUrl };
  const chainProvider = new TerraChainProvider(terraNetwork);
  const walletProvider = new TerraWalletProvider(walletOptions, chainProvider);
  const swapProvider = new TerraSwapProvider(helperUrl, walletProvider);
  return new Client().connect(swapProvider);
}

export function createSolanaClient(network: Network, mnemonic: string, derivationPath: string) {
  const solanaNetwork = ChainNetworks.solana[network];
  const walletOptions = { mnemonic, derivationPath };
  const chainProvider = new SolanaChainProvider(solanaNetwork);
  const walletProvider = new SolanaWalletProvider(walletOptions, chainProvider);
  return new Client().connect(walletProvider);
}
