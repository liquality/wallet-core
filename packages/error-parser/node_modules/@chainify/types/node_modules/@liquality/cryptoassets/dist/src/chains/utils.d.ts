import { INetwork } from '../interfaces/INetwork';
import { ExplorerView, NftProviderType } from '../types';
import { BaseChain } from './BaseChain';
export declare const transformMainnetToTestnetChain: (chain: BaseChain, network: INetwork, explorerViews: ExplorerView[], faucetUrl: string, nftProviderType?: NftProviderType) => BaseChain;
