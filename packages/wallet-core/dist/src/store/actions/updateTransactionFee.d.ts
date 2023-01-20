import { Transaction } from '@chainify/types';
import { ActionContext } from '..';
import { Asset, Network, WalletId } from '../types';
export declare const updateTransactionFee: (context: ActionContext, { network, walletId, asset, id, hash, newFee, }: {
    network: Network;
    walletId: WalletId;
    asset: Asset;
    id: string;
    hash: string;
    newFee: number;
}) => Promise<Transaction>;
