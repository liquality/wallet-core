import { ActionContext } from '../..';
import { Asset, Network, WalletId } from '../../types';
declare type HistoryUpdateFunction<T> = () => Promise<Partial<T> | undefined>;
export declare function withLock<T>({ dispatch }: ActionContext, { item, network, walletId, asset }: {
    item: T;
    network: Network;
    walletId: WalletId;
    asset: Asset;
}, func: () => Promise<Partial<T>>): Promise<Partial<T>>;
export declare function withInterval<T>(func: HistoryUpdateFunction<T>): Promise<Partial<T>>;
export {};
