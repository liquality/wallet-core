import { ChainId } from '@liquality/cryptoassets';
import { FeeDetails, Transaction } from '@liquality/types';

export type NetworkWalletIdMap<T> = Partial<
  Record<Network, Record<WalletId, T>>
>;
export type WalletIdNetworkMap<T> = Partial<
  Record<WalletId, Record<Network, T>>
>;

export enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

export type WalletId = string;
export type AccountId = string;
export type Asset = string;

export interface Wallet {
  id: WalletId;
  name: string;
  mnemonic: string;
  at: number;
  imported: boolean;
}

export interface CustomToken {
  symbol: string;
  name: string;
  contractAddress: string;
  decimals: number;
  chain: ChainId;
}

export enum AccountType {
  Default = 'default',
  BitcoinLedgerNativeSegwit = 'bitcoin_ledger_nagive_segwit',
  BitcoinLedgerLegacy = 'bitcoin_ledger_legacy',
  EthereumLedger = 'ethereum_ledger',
  RskLedger = 'rsk_ledger',
}

export interface Account {
  id: AccountId;
  walletId: WalletId;
  type: AccountType;
  name: string;
  alias: string;
  chain: ChainId;
  index: number;
  derivationPath: string;
  addresses: string[];
  assets: Asset[];
  balances: Record<Asset, string>;
  createdAt: number;
  updatedAt?: number;
  color: string;
  enabled: boolean;
}

export interface MarketData {
  from: Asset;
  to: Asset;
  provider: string;
  rate: number;
  max: string;
  min: string;
}

export enum FeeLabel {
  Slow = 'slow',
  Average = 'average',
  Fast = 'fast',
}

export enum TransactionType {
  Send = 'SEND',
  Swap = 'SWAP',
}

export enum SwapProviderType {
  Liquality = 'liquality',
  LiqualityBoost = 'liqualityBoost',
  UniswapV2 = 'uniswapV2',
  FastBTC = 'fastBTC',
  OneInch = 'oneinchV4',
  Sovryn = 'sovryn',
  Thorchain = 'thorchain',
  Astroport = 'astroport',
}

export interface HistoryItem {
  fee: number;
  feeLabel: FeeLabel;
  from: Asset;
  id: string;
  network: Network;
  receiveFee: string;
  startTime: number;
  status: string; // TODO: actual types?
  to: Asset;
  type: TransactionType; // swpa send?
  walletId: WalletId;
}

export interface SendHistoryItem extends HistoryItem {
  toAddress: string;
  amount: string;
  tx: Transaction;
  txHash: string;
  accountId: AccountId;
  fiatRate: number;
}

export interface SwapHistoryItem extends HistoryItem {
  claimFeeLabel: FeeLabel;
  fromAmount: string;
  fromAccountId: AccountId;
  fromFundHash: string;
  fromFundTx: Transaction;
  maxFeeSlippageMultiplier: number;
  provider: SwapProviderType;
  slippage: number;
  toAccountId: AccountId;
  toAmount: string;
}

export enum ExperimentType {
  ManageAccounts = 'manageAccounts',
}

export type ChainAccountIdMap = {
  ChainId: string[];
};

export interface Connections extends ChainAccountIdMap {
  defaultEthereum: string;
}

export type ExternalConnections = Record<WalletId, Record<string, Connections>>;

export interface RootState {
  version: number;

  // <do not keep these in localStorage>
  key: string;
  wallets: Wallet[];
  unlockedAt: number;
  // </do not keep these in localStorage>

  brokerReady: boolean;

  encryptedWallets: string;

  enabledAssets: NetworkWalletIdMap<Asset[]>;
  customTokens: NetworkWalletIdMap<CustomToken[]>;

  accounts: WalletIdNetworkMap<Account[]>;

  fiatRates: Record<Asset, number>;
  fees: NetworkWalletIdMap<Record<Asset, FeeDetails>>;
  history: NetworkWalletIdMap<HistoryItem[]>;
  marketData: Partial<Record<Network, MarketData[]>>;

  activeNetwork: Network;
  activeWalletId: WalletId;

  keyUpdatedAt: number;
  keySalt: string;
  termsAcceptedAt: number;
  setupAt: number;

  injectEthereum: boolean;
  injectEthereumChain: ChainId;
  usbBridgeWindowsId: number;

  externalConnections: ExternalConnections;
  rskLegacyDerivation: boolean;
  analytics: {
    userId: string;
    acceptedDate: number;
    askedDate: number;
    askedTimes: number;
    notAskAgain: boolean;
  };
  experiments: Partial<Record<ExperimentType, boolean>>;
  watsNewModalVersion: string;
  enabledChains: WalletIdNetworkMap<ChainId[]>;
}
