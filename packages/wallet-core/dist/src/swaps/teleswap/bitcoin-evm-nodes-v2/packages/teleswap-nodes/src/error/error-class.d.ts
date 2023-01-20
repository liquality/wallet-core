export = ErrorHandler;
declare class ErrorHandler {
    constructor({ defaultPriority, sendToAdminPriorityThd }: {
        defaultPriority?: number | undefined;
        sendToAdminPriorityThd?: number | undefined;
    }, logger?: undefined);
    defaultPriority: number;
    sendToAdminPriorityThd: number;
    logger: any;
    logWarn(message: any): void;
    logError(message: any): void;
    logErrorMessage(err: any, extraMoreInfo: any): void;
    checkAndSendErrorToAdmin(err: any, extraMoreInfo: any): Promise<void>;
    handleError(err: any, moreInfo: any): Promise<void>;
    handleErrorAndExit(err: any, moreInfo: any): Promise<void>;
    sendErrorToAdminByPriority(message: any, errorPriority: any): Promise<void>;
}
