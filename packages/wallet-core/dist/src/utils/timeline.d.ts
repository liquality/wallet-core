import { Client } from '@chainify/client';
import { Transaction } from '@chainify/types';
import { Asset, Network, SwapHistoryItem, WalletId } from '../store/types';
export declare enum TimelineSide {
    RIGHT = "right",
    LEFT = "left"
}
export declare enum TimelineAction {
    LOCK = "lock",
    CLAIM = "claim",
    REFUND = "refund",
    RECEIVE = "receive",
    APPROVE = "approve",
    SWAP = "swap"
}
export declare const ACTIONS_TERMS: {
    lock: {
        default: string;
        pending: string;
        completed: string;
        failed: string;
    };
    claim: {
        default: string;
        pending: string;
        completed: string;
        failed: string;
    };
    approve: {
        default: string;
        pending: string;
        completed: string;
        failed: string;
    };
    receive: {
        default: string;
        pending: string;
        completed: string;
        failed: string;
    };
    swap: {
        default: string;
        pending: string;
        completed: string;
        failed: string;
    };
    refund: {
        default: string;
        pending: string;
        completed: string;
        failed: string;
    };
};
export interface TimelineStep {
    side: TimelineSide;
    pending: boolean;
    completed: boolean;
    title: string;
    tx?: Transaction;
}
export declare type GetClientFunction = (options: {
    walletId: WalletId;
    network: Network;
    asset: Asset;
}) => Client;
export declare type GetStepFunction = (completed: boolean, pending: boolean, side: TimelineSide) => Promise<TimelineStep>;
export interface TimelineTransaction extends Transaction {
    asset: string;
    explorerLink: string;
}
export declare function getSwapTimeline(item: SwapHistoryItem, getClient: GetClientFunction): Promise<TimelineStep[]>;
