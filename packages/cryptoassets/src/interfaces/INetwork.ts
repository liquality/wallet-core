export interface INetwork {
  name: string;

  coinType: string;
  isTestnet: boolean;

  chainId?: string | number;
  networkId?: string | number;

  rpcUrls: string[];
  scraperUrl?: string;
  utxo?: IUtxoNetwork;
}

export interface IUtxoNetwork {
  messagePrefix: string;
  bech32: string;
  bip32: Bip32;
  pubKeyHash: number;
  scriptHash: number;
  wif: number;
}

interface Bip32 {
  public: number;
  private: number;
}
