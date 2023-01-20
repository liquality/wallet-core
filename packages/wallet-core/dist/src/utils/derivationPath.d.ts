import { ChainId } from '@liquality/cryptoassets';
import { AccountType, Network } from '../store/types';
export declare type DerivationPathCreator = {
    [key in ChainId]?: (network: Network, index: number, accountType?: AccountType) => string;
};
export declare const getDerivationPath: (chainId: ChainId, network: Network, index: number, accountType: AccountType) => string;
