export declare const FAKE_ERROR = "Fake Error";
export declare function getError(func: () => unknown): any;
export declare function getErrorAsync(func: () => Promise<unknown>): Promise<any>;
