import { Notification } from '../../types';
import { HistoryItem } from '../types';
export declare const createNotification: (config: Notification) => Promise<void>;
export declare const createHistoryNotification: (item: HistoryItem) => Promise<void> | undefined;
