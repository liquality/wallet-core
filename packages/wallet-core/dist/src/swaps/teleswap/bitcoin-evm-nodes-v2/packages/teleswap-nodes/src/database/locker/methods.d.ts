export function setLastCheckedBitcoinBlock(blockNumber: any): Promise<any>;
export function getLastCheckedBitcoinBlock(): Promise<any>;
export function setLastCheckedEthBlock(blockNumber: any): Promise<any>;
export function getLastCheckedEthBlock(): Promise<any>;
export function addBurnRequestToQueue(parsedEvent: any): Promise<any>;
export function removeInvalidRequestFromQueue(requestIndex: any): Promise<any>;
export function getNotProcessedRequests(limit?: number): Promise<any[]>;
export function deleteRequestAndAddPendingTxId(txId: any, requests: any): Promise<any>;
export function deletePendingTxAndUpdateLastTx(txInfo: any): Promise<void>;
export function getPendingRequestsIndex(): Promise<any[]>;
export function getPendingTransactions(): Promise<{
    txId: any;
    requests: any;
}[]>;
