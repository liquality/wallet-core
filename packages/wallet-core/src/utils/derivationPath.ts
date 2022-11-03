import { BitcoinTypes } from '@chainify/bitcoin';
import { ChainId, getChain } from '@liquality/cryptoassets';
import { CUSTOM_ERRORS, createInternalError } from '@liquality/error-parser';
import { AccountType, Network } from '../store/types';
import { BTC_ADDRESS_TYPE_TO_PREFIX } from '../utils/address';
import { LEDGER_BITCOIN_OPTIONS } from '../utils/ledger';

export type DerivationPathCreator = {
  [key in ChainId]?: (network: Network, index: number, accountType?: AccountType) => string;
};

export const getDerivationPath = (chainId: ChainId, network: Network, index: number, accountType: AccountType) => {
  const pathFunction = derivationPaths[chainId];

  if (!pathFunction) {
    const chain = getChain(network, chainId);

    // for all EVM chains return the same method
    if (chain.isEVM) {
      return getEVMBasedDerivationPath(chain.network.coinType, index, accountType);
    } else {
      throw createInternalError(CUSTOM_ERRORS.NotFound.Chain.DerivationPath(chainId));
    }
  }

  return pathFunction(network, index, accountType);
};

const derivationPaths: DerivationPathCreator = {
  // == EVM CHAINS START ==
  [ChainId.Rootstock]: (network: Network, index: number, accountType = AccountType.Default) => {
    let coinType;
    if (accountType === AccountType.RskLedger) {
      coinType = network === 'mainnet' ? '137' : '37310';
    } else {
      coinType = getChain(network, ChainId.Rootstock).network.coinType;
    }
    return getEVMBasedDerivationPath(coinType, index, accountType);
  },
  // == EVM CHAINS END ==

  [ChainId.Bitcoin]: (network: Network, index: number, accountType = AccountType.Default) => {
    const coinType = getChain(network, ChainId.Bitcoin).network.coinType;
    return getBitcoinDerivationPath(accountType, coinType, index);
  },
  [ChainId.Near]: (network: Network, index: number) => {
    const coinType = getChain(network, ChainId.Near).network.coinType;
    return `m/44'/${coinType}'/${index}'`;
  },
  [ChainId.Solana]: (network: Network, index: number) => {
    const coinType = getChain(network, ChainId.Solana).network.coinType;
    return `m/44'/${coinType}'/${index}'/0'`;
  },
  [ChainId.Terra]: (network: Network, index: number) => {
    const coinType = getChain(network, ChainId.Terra).network.coinType;
    return `'m/44'/${coinType}'/${index}'`;
  },
};

const getEVMBasedDerivationPath = (coinType: string, index: number, accountType = AccountType.Default) => {
  if (accountType === AccountType.EthereumLedger || accountType === AccountType.RskLedger) {
    return `m/44'/${coinType}'/${index}'/0/0`;
  }
  return `m/44'/${coinType}'/0'/0/${index}`;
};

const getBitcoinDerivationPath = (accountType: AccountType, coinType: string, index: number) => {
  if (accountType.includes('ledger')) {
    const option = LEDGER_BITCOIN_OPTIONS.find((o) => o.name === accountType);
    if (!option) {
      throw createInternalError(CUSTOM_ERRORS.NotFound.AccountTypeOption(accountType));
    }
    const { addressType } = option;
    return `${BTC_ADDRESS_TYPE_TO_PREFIX[addressType]}'/${coinType}'/${index}'`;
  } else {
    return `${BTC_ADDRESS_TYPE_TO_PREFIX[BitcoinTypes.AddressType.BECH32]}'/${coinType}'/${index}'`;
  }
};
