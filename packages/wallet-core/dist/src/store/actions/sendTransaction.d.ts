import { BigNumber } from 'bignumber.js';
import { ActionContext } from '..';
import { AccountId, Asset, FeeLabel, Network, SendHistoryItem, WalletId } from '../types';
export declare const sendTransaction: (context: ActionContext, { network, walletId, accountId, asset, to, amount, data, fee, feeAsset, gas, feeLabel, fiatRate, }: {
    network: Network;
    walletId: WalletId;
    accountId: AccountId;
    asset: Asset;
    to: Asset;
    amount: BigNumber;
    data: string;
    fee: number;
    feeAsset: string;
    gas: number;
    feeLabel: FeeLabel;
    fiatRate: number;
}) => Promise<SendHistoryItem>;
