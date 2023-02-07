import { ActionContext } from '..';
import { Asset, Network, WalletId } from '../types';
export declare const disableAssets: (context: ActionContext, { network, walletId, assets }: {
    network: Network;
    walletId: WalletId;
    assets: Asset[];
}) => Promise<void>;
