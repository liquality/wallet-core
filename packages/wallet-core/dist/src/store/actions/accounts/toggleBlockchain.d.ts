import { ChainId } from '@liquality/cryptoassets';
import { ActionContext } from '../..';
import { Network, WalletId } from '../../types';
export declare const toggleBlockchain: (context: ActionContext, { network, walletId, chainId, enable }: {
    network: Network;
    walletId: WalletId;
    chainId: ChainId;
    enable: boolean;
}) => Promise<void>;
