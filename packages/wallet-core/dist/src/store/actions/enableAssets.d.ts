import { ActionContext } from '..';
import { Asset, Network, WalletId } from '../types';
export declare const enableAssets: (context: ActionContext, { network, walletId, assets }: {
    network: Network;
    walletId: WalletId;
    assets: Asset[];
}) => Promise<void>;
