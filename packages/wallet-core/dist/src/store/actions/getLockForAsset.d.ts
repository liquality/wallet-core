import { ActionContext } from '..';
import { Asset, BaseHistoryItem, Network, WalletId } from '../types';
export declare const getLockForAsset: (context: ActionContext, { network, walletId, asset, item }: {
    network: Network;
    walletId: WalletId;
    asset: Asset;
    item: BaseHistoryItem;
}) => Promise<string>;
