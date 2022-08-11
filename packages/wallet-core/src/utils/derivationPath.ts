import { BitcoinTypes } from '@chainify/bitcoin';
import { ChainId } from '@liquality/cryptoassets';
import { AccountType, Network } from '../store/types';
import { BTC_ADDRESS_TYPE_TO_PREFIX } from '../utils/address';
import { LEDGER_BITCOIN_OPTIONS } from '../utils/ledger';
import { ChainNetworks } from '../utils/networks';

export type DerivationPathCreator = {
  [key in ChainId]?: (network: Network, index: number, accountType?: AccountType) => string;
};

export const getDerivationPath = (chainId: ChainId, network: Network, index: number, accountType: AccountType) => {
  const pathFunction = derivationPaths[chainId];
  if (!pathFunction) {
    throw new Error(`Derivation path creator for chain ${chainId} not implemented`);
  }
  return pathFunction(network, index, accountType);
};

const derivationPaths: DerivationPathCreator = {
  // == EVM CHAINS START ==
  [ChainId.Ethereum]: (network: Network, index: number, accountType = AccountType.Default) => {
    const ethNetwork = ChainNetworks[ChainId.Ethereum][network];
    return getEthereumBasedDerivationPath(ethNetwork.coinType, index, accountType);
  },
  [ChainId.BinanceSmartChain]: (network: Network, index: number, accountType = AccountType.Default) => {
    const ethNetwork = ChainNetworks[ChainId.BinanceSmartChain][network];
    return getEthereumBasedDerivationPath(ethNetwork.coinType, index, accountType);
  },
  [ChainId.Polygon]: (network: Network, index: number, accountType = AccountType.Default) => {
    const ethNetwork = ChainNetworks[ChainId.Polygon][network];
    return getEthereumBasedDerivationPath(ethNetwork.coinType, index, accountType);
  },
  [ChainId.Arbitrum]: (network: Network, index: number, accountType = AccountType.Default) => {
    const ethNetwork = ChainNetworks[ChainId.Arbitrum][network];
    return getEthereumBasedDerivationPath(ethNetwork.coinType, index, accountType);
  },
  [ChainId.Avalanche]: (network: Network, index: number, accountType = AccountType.Default) => {
    const ethNetwork = ChainNetworks[ChainId.Avalanche][network];
    return getEthereumBasedDerivationPath(ethNetwork.coinType, index, accountType);
  },
  [ChainId.Fuse]: (network: Network, index: number, accountType = AccountType.Default) => {
    const ethNetwork = ChainNetworks[ChainId.Fuse][network];
    return getEthereumBasedDerivationPath(ethNetwork.coinType, index, accountType);
  },
  [ChainId.Rootstock]: (network: Network, index: number, accountType = AccountType.Default) => {
    let coinType;
    if (accountType === AccountType.RskLedger) {
      coinType = network === 'mainnet' ? '137' : '37310';
    } else {
      const ethNetwork = ChainNetworks[ChainId.Rootstock][network];
      coinType = ethNetwork.coinType;
    }

    return getEthereumBasedDerivationPath(coinType, index, accountType);
  },
  // == EVM CHAINS END ==

  [ChainId.Bitcoin]: (network: Network, index: number, accountType = AccountType.Default) => {
    const bitcoinNetwork = ChainNetworks[ChainId.Bitcoin][network];
    return getBitcoinDerivationPath(accountType, bitcoinNetwork.coinType, index);
  },
  [ChainId.Near]: (network: Network, index: number) => {
    const nearNetwork = ChainNetworks[ChainId.Near][network];
    return `m/44'/${nearNetwork.coinType}'/${index}'`;
  },
  [ChainId.Solana]: (network: Network, index: number) => {
    const solanaNetwork = ChainNetworks[ChainId.Solana][network];
    return `m/44'/${solanaNetwork.coinType}'/${index}'/0'`;
  },
  [ChainId.Terra]: (network: Network, index: number) => {
    const terraNetwork = ChainNetworks[ChainId.Terra][network];
    return `'m/44'/${terraNetwork.coinType}'/${index}'`;
  },
};

const getEthereumBasedDerivationPath = (coinType: string, index: number, accountType = AccountType.Default) => {
  if (accountType === AccountType.EthereumLedger || accountType === AccountType.RskLedger) {
    return `m/44'/${coinType}'/${index}'/0/0`;
  }
  return `m/44'/${coinType}'/0'/0/${index}`;
};

const getBitcoinDerivationPath = (accountType: AccountType, coinType: string, index: number) => {
  if (accountType.includes('ledger')) {
    const option = LEDGER_BITCOIN_OPTIONS.find((o) => o.name === accountType);
    if (!option) {
      throw new Error(`Option not found for account type ${accountType}`);
    }
    const { addressType } = option;
    return `${BTC_ADDRESS_TYPE_TO_PREFIX[addressType]}'/${coinType}'/${index}'`;
  } else {
    return `${BTC_ADDRESS_TYPE_TO_PREFIX[BitcoinTypes.AddressType.BECH32]}'/${coinType}'/${index}'`;
  }
};
