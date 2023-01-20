import { Transaction } from './Transaction';
export interface Block<BlockType = any, TransactionType = any> {
    number: number;
    hash: string;
    timestamp: number;
    parentHash?: string;
    difficulty?: number;
    nonce?: number;
    size?: number;
    transactions?: Transaction<TransactionType>[];
    _raw: BlockType;
}
