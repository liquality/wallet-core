import { ChainId } from '@liquality/cryptoassets';
import { FeeDetails, Transaction } from '@liquality/types';

export type NetworkWalletIdMap<T> = Partial<Record<Network, Record<WalletId, T>>>;
export type WalletIdNetworkMap<T> = Partial<Record<WalletId, Record<Network, T>>>;

export enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

export type WalletId = string;
export type AccountId = string;
export type Asset = string;
export type FiatRates = Record<Asset, number>;
export type AnalyticsState = {
  userId: string;
  acceptedDate: number;
  askedDate: number;
  askedTimes: number;
  notAskAgain: boolean;
};
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

export interface AccountDefinition {
  type: AccountType;
  name: string;
  alias?: string;
  chain: ChainId;
  index: number;
  derivationPath?: string;
  addresses: string[];
  assets: Asset[];
  balances: Record<Asset, string>;
  updatedAt?: number;
  color: string;
  enabled?: boolean;
}

export interface Account extends AccountDefinition {
  id: AccountId;
  walletId: WalletId;
  createdAt: number;
  enabled: boolean;
  derivationPath: string;
}

export interface PairData {
  from: Asset;
  to: Asset;
  rate: string;
  max: string;
  min: string;
}

export interface MarketData extends PairData {
  provider: string;
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
  LiqualityBoostNativeToERC20 = 'liqualityBoostNativeToERC20',
  LiqualityBoostERC20ToNative = 'liqualityBoostERC20toNative',
  UniswapV2 = 'uniswapV2',
  FastBTC = 'fastBTC',
  OneInch = 'oneinchV4',
  Sovryn = 'sovryn',
  Thorchain = 'thorchain',
  Astroport = 'astroport',
}

export interface BaseHistoryItem {
  fee: number;
  feeLabel: FeeLabel;
  from: Asset;
  id: string;
  network: Network;
  startTime: number;
  endTime?: number;
  status: string; // TODO: actual types?
  to: Asset;
  type: TransactionType; // swpa send?
  walletId: WalletId;
  error?: string;
  waitingForLock?: boolean;
}

export enum SendStatus {
  WAITING_FOR_CONFIRMATIONS = 'WAITING_FOR_CONFIRMATIONS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface SendHistoryItem extends BaseHistoryItem {
  type: TransactionType.Send;
  toAddress: string;
  amount: number;
  tx: Transaction;
  txHash: string;
  accountId: AccountId;
  fiatRate: number;
  status: SendStatus;
}

export interface SwapHistoryItem extends BaseHistoryItem {
  type: TransactionType.Swap;
  claimFeeLabel: FeeLabel;
  claimFee: number;
  fromAmount: string;
  fromAccountId: AccountId;
  fromFundHash: string;
  fromFundTx: Transaction;
  maxFeeSlippageMultiplier: number;
  provider: string;
  slippage: number;
  toAccountId: AccountId;
  toAmount: string;
  bridgeAsset?: Asset;
  receiveFee?: string;
}

export type HistoryItem = SendHistoryItem | SwapHistoryItem;

export enum ExperimentType {
  ManageAccounts = 'manageAccounts',
}

export type ChainAccountIdMap = {
  [key in ChainId]: string[];
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

  fiatRates: FiatRates;
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
  analytics: AnalyticsState;
  experiments: Partial<Record<ExperimentType, boolean>>;
  watsNewModalVersion: string;
  enabledChains: WalletIdNetworkMap<ChainId[]>;
}
