export function addBurnRequestForLocker(parsedEvent: any): Promise<any>;
export function getPassedDeadlineRequestsEvent(blockNumber: any): Promise<any[]>;
export function getCurrentBurnRequests(blockNumber: any): Promise<any[]>;
export function deleteBurnRequest(lockerTargetAddress: any, index: any): Promise<any>;
export function saveBurnTransactions(tx: any): Promise<any>;
export function getBurnTransactions(blockNumber: any, deadlinePlusOne: any): Promise<any[]>;
export function deleteBurnTransaction(txId: any): Promise<any>;
