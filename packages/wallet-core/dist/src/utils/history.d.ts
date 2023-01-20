import { HistoryItem, TransactionType } from '../store/types';
export declare const SEND_STATUS_STEP_MAP: {
    WAITING_FOR_CONFIRMATIONS: number;
    SUCCESS: number;
    FAILED: number;
};
export declare const SEND_STATUS_LABEL_MAP: {
    WAITING_FOR_CONFIRMATIONS: string;
    SUCCESS: string;
    FAILED: string;
};
export declare function getStatusLabel(item: HistoryItem): string | undefined;
export declare function getStep(item: HistoryItem): number;
export declare const ACTIVITY_FILTER_TYPES: {
    SWAP: {
        label: string;
        icon: string;
    };
    NFT: {
        label: string;
        icon: string;
    };
    SEND: {
        label: string;
        icon: string;
    };
    RECEIVE: {
        label: string;
        icon: string;
    };
};
export declare const ACTIVITY_STATUSES: {
    PENDING: {
        label: string;
        icon: string;
    };
    COMPLETED: {
        label: string;
        icon: string;
    };
    FAILED: {
        label: string;
        icon: string;
    };
    NEEDS_ATTENTION: {
        label: string;
        icon: string;
    };
    REFUNDED: {
        label: string;
        icon: string;
    };
};
export declare const SEND_STATUS_FILTER_MAP: {
    WAITING_FOR_CONFIRMATIONS: string;
    SUCCESS: string;
    FAILED: string;
};
export declare const applyActivityFilters: (activity: HistoryItem[], filters: {
    types: TransactionType[];
    statuses: string[];
    dates: {
        start: string;
        end: string;
    };
}) => HistoryItem[];
