import { CovalentNftProvider, EvmBaseWalletProvider, MoralisNftProvider, OpenSeaNftProvider } from '@chainify/evm';
import { BaseProvider } from '@ethersproject/providers';
import { NftProviderType } from '../../store/types';
export declare function getNftProvider(providerType: NftProviderType, walletProvider: EvmBaseWalletProvider<BaseProvider>, testnet: boolean): OpenSeaNftProvider | MoralisNftProvider | CovalentNftProvider;
