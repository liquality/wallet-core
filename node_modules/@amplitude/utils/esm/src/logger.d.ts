import { LogLevel } from '@amplitude/types';
/** JSDoc */
declare class Logger {
    /** JSDoc */
    private _logLevel;
    /** JSDoc */
    constructor();
    /** JSDoc */
    disable(): void;
    /** JSDoc */
    enable(logLevel?: LogLevel): void;
    /** JSDoc */
    log(...args: any[]): void;
    /** JSDoc */
    warn(...args: any[]): void;
    /** JSDoc */
    error(...args: any[]): void;
}
declare let logger: Logger;
export { logger };
//# sourceMappingURL=logger.d.ts.map