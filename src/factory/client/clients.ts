import {
  BitcoinEsploraApiProvider,
  BitcoinFeeApiProvider,
  BitcoinHDWalletProvider,
  BitcoinSwapEsploraProvider,
} from '@chainify/bitcoin';
import { BitcoinLedgerProvider } from '@chainify/bitcoin-ledger';
import { Client, Fee } from '@chainify/client';
import {
  CovalentNftProvider,
  EvmBaseWalletProvider,
  EvmChainProvider,
  EvmSwapProvider,
  EvmTypes,
  EvmWalletProvider,
  MoralisNftProvider,
  OpenSeaNftProvider,
} from '@chainify/evm';
import { EvmLedgerProvider } from '@chainify/evm-ledger';
import { WebHidTransportCreator } from '@chainify/hw-ledger';
import { NearChainProvider, NearSwapProvider, NearTypes, NearWalletProvider } from '@chainify/near';
import { SolanaChainProvider, SolanaWalletProvider } from '@chainify/solana';
import { TerraChainProvider, TerraSwapProvider, TerraTypes, TerraWalletProvider } from '@chainify/terra';
import { Network as ChainifyNetwork, Nullable } from '@chainify/types';
import { BaseProvider } from '@ethersproject/providers';
import buildConfig from '../../build.config';
import { Account, AccountType, Network, NftProviderType } from '../../store/types';
import { LEDGER_BITCOIN_OPTIONS } from '../../utils/ledger';
import { ChainNetworks } from '../../utils/networks';

const ledgerTransportCreator = new WebHidTransportCreator();

function getNftProvider(
  providerType: NftProviderType,
  walletProvider: EvmBaseWalletProvider<BaseProvider>,
  testnet: boolean
) {
  switch (providerType) {
    case NftProviderType.OpenSea:
      return new OpenSeaNftProvider(walletProvider, {
        url: 'https://api.opensea.io/api/v1/',
        apiKey: '963da5bcea554a92b078fe1f48a2300e',
      });
    case NftProviderType.Moralis:
      if (testnet) {
        return new MoralisNftProvider(walletProvider, {
          url: 'https://tjgwcry8a7dd.usemoralis.com:2053/server',
          appId: 'PwWfldBBlRaVWGihW4K6LqL4AQbmVNTI3w2OyDhN',
          apiKey: 'X9Bg0wQh5rzvbZ3owmtqAsxdMTy3L81jnz6BNVsj',
        });
      }
      return new MoralisNftProvider(walletProvider, {
        url: 'https://ghi7f9miezr7.usemoralis.com:2053/server',
        appId: 'T94TjnFcaFycYfHqkf227JmpZeEjGXmDWINkfJD2',
        apiKey: 'iv94v0ZQgQfIkTe09QLple1DDAGbmAD8zX9BeVGo',
      });
    case NftProviderType.Covalent:
      return new CovalentNftProvider(walletProvider, {
        url: 'https://api.covalenthq.com/v1',
        apiKey: 'ckey_e26519be33bb4587a8145b2df06',
      });
  }
}

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
    const ledgerProvider = new BitcoinLedgerProvider(
      {
        network: bitcoinNetwork,
        addressType,
        baseDerivationPath,
        basePublicKey: account?.publicKey,
        baseChainCode: account?.chainCode,
        transportCreator: ledgerTransportCreator,
      },
      chainProvider
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
  ethereumNetwork: ChainifyNetwork,
  feeProvider: Fee,
  mnemonic: string,
  accountType: AccountType,
  derivationPath: string,
  swapOptions: EvmTypes.EvmSwapOptions,
  nftProviderType?: NftProviderType
) {
  // disable multicall for all networks until it's utilized properly
  const chainProvider = new EvmChainProvider(ethereumNetwork, undefined, feeProvider, false);
  const swapProvider = new EvmSwapProvider(swapOptions);

  let walletProvider;
  if (accountType === AccountType.EthereumLedger || accountType === AccountType.RskLedger) {
    walletProvider = new EvmLedgerProvider(
      {
        network: ethereumNetwork,
        derivationPath,
        transportCreator: ledgerTransportCreator,
      },
      chainProvider
    );
  } else {
    const walletOptions = { derivationPath, mnemonic };
    walletProvider = new EvmWalletProvider(walletOptions, chainProvider);
  }
  swapProvider.setWallet(walletProvider);

  const client = new Client().connect(swapProvider);

  if (nftProviderType) {
    const nftProvider = getNftProvider(nftProviderType, walletProvider, ethereumNetwork.isTestnet);
    client.connect(nftProvider);
  }

  return client;
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
