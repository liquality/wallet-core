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
  NFT = 'NFT',
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
  type: TransactionType;
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
  amount: string;
  tx: Transaction;
  txHash: string;
  accountId: AccountId;
  fiatRate: number;
  status: SendStatus;
}

export interface NFTSendHistoryItem extends BaseHistoryItem {
  type: TransactionType.NFT;
  toAddress: string;
  tx: Transaction;
  nft: NFTAsset;
  txHash: string;
  accountId: AccountId;
  status: SendStatus;
}

export interface SwapHistoryItem extends BaseHistoryItem {
  type: TransactionType.Swap;
  claimFeeLabel: FeeLabel;
  claimFee: number;
  fromAmount: string;
  fromAccountId: AccountId;
  provider: string;
  slippage: number;
  toAccountId: AccountId;
  toAmount: string;
  bridgeAsset?: Asset;
  path?: string[];
}

export type HistoryItem = NFTSendHistoryItem | SendHistoryItem | SwapHistoryItem;

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

  nftAssets: NFTAsset[];
}

export type NFTAsset = {
  animation_original_url: string;
  animation_url: string;
  asset_contract: {
    address: string;
    asset_contract_type: string;
    buyer_fee_basis_points: number;
    created_date: string;
    default_to_fiat: boolean;
    description: string;
    dev_buyer_fee_basis_points: number;
    dev_seller_fee_basis_points: number;
    external_link: string;
    image_url: string;
    name: string;
    nft_version: string;
    only_proxied_transfers: false;
    opensea_buyer_fee_basis_points: number;
    opensea_seller_fee_basis_points: number;
    opensea_version: string;
    owner: number;
    payout_address: string;
    schema_name: string;
    seller_fee_basis_points: number;
    symbol: string;
    total_supply: string | number;
  };
  background_color: string;
  collection: {
    banner_image_url: string;
    chat_url: string;
    created_date: string;
    default_to_fiat: boolean;
    description: string;
    dev_buyer_fee_basis_points: string;
    dev_seller_fee_basis_points: string;
    discord_url: string;
    display_data: {
      card_display_style: string;
      images: {
        [key: string]: string | number;
      }[];
    };
    external_url: string;
    featured: boolean;
    featured_image_url: string;
    hidden: boolean;
    image_url: string;
    instagram_username: string;
    is_nsfw: boolean;
    is_subject_to_whitelist: boolean;
    large_image_url: string;
    medium_username: string;
    name: string;
    only_proxied_transfers: boolean;
    opensea_buyer_fee_basis_points: string;
    opensea_seller_fee_basis_points: string;
    payout_address: string;
    require_email: boolean;
    safelist_request_status: string;
    short_description: string;
    slug: string;
    telegram_url: string;
    twitter_username: string;
    wiki_url: string;
  };
  creator: {
    address: string;
    config: string;
    profile_img_url: string;
    user: {
      username: string;
    };
  };
  decimals: number | string;
  description: string;
  external_link: string;
  id: number;
  image_original_url: string;
  image_preview_url: string;
  image_thumbnail_url: string;
  image_url: string;
  is_nsfw: boolean;
  is_presale: boolean;
  last_sale: string;
  listing_date: string;
  name: string;
  num_sales: number;
  owner: {
    address: string;
    config: string;
    profile_img_url: string;
    user: {
      username: string;
    };
  };
  permalink: string;
  sell_orders: number | string;
  starred: false;
  token_id: number;
  token_metadata: string;
  top_bid: number | string;
  traits: {
    display_type: string;
    max_value: number | string;
    order: string;
    trait_count: number;
    trait_type: string;
    value: string;
  }[];
  transfer_fee: number | string;
  transfer_fee_payment_token: number | string;
};

export type NFTAssets = {
  [key: string]: NFTAsset[];
};
