/**
 * Helper utility that processes promises one by one in the order they arrive,
 * with an optional time-out value.
 */
export declare class AsyncQueue {
    private readonly _promiseQueue;
    private _promiseInProgress;
    addToQueue<T = any>(promiseGenerator: () => Promise<T>): Promise<T>;
    private _notifyUploadFinish;
}
//# sourceMappingURL=queue.d.ts.map