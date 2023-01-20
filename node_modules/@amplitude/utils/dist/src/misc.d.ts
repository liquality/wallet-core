/**
 * Checks whether we're in a Node.js environment
 *
 * @returns Answer to given question
 */
export declare function isNodeEnv(): boolean;
/**
 * Checks whether we're in a browser environment
 *
 * @returns Answer to given question
 */
export declare function isBrowserEnv(): boolean;
/**
 * Safely get global scope object
 *
 * @returns Global scope object
 */
export declare const getGlobalObject: () => any;
export declare const getGlobalAmplitudeNamespace: () => any;
/**
 * A promise-based way to sleep for x millseconds, then queue ourselves back to the
 * JS event loop.
 *
 * @param milliseconds The number of milliseconds to wait for
 */
export declare const asyncSleep: (milliseconds: number) => Promise<void>;
/**
 * Fixes browser edge case where Prototype.js injects Array.prototype.toJSON and breaks the built-in JSON.stringify()
 *
 * @returns true if Array.prototype.toJSON was deleted, false if not
 */
export declare const prototypeJsFix: () => boolean;
//# sourceMappingURL=misc.d.ts.map