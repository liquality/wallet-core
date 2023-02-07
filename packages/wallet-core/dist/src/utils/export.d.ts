import { HistoryItem } from '../store/types';
export declare const getCSVContent: (data: HistoryItem[], headers: {
    label: string;
    key: string;
}[]) => string | null;
