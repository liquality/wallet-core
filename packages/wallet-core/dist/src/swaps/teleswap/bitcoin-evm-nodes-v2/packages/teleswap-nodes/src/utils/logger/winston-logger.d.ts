export = WinstonLogger;
declare class WinstonLogger {
    constructor({ environment, logLevel, applicationName }: {
        environment?: string | undefined;
        logLevel?: string | undefined;
        applicationName?: string | undefined;
    });
    environment: string;
    applicationName: string;
    logFilePath: string;
    loggerOptions: {
        file: {
            level: string;
            handleExceptions: boolean;
            filename: string;
            format: any;
            maxsize: number;
            maxFiles: number;
            tailable: boolean;
        };
        console: {
            handleExceptions: boolean;
            level: string;
            format: any;
        };
    };
    logger: any;
    createLogger(loggerName?: string): any;
    getLogger(spec?: string): any;
}
