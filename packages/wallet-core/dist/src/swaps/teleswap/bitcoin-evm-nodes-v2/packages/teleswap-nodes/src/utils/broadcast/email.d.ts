export = Email;
declare class Email {
    constructor({ host, port, username, password, from, defaultReceivers, defaultSubject }: {
        host: any;
        port: any;
        username: any;
        password: any;
        from: any;
        defaultReceivers?: any[] | undefined;
        defaultSubject?: string | undefined;
    }, enabled: any);
    enabled: any;
    isVerified: boolean;
    numberOfError: number;
    from: any;
    defaultReceivers: any[];
    defaultSubject: string;
    nodemailerTransporter: any;
    verify(): Promise<any>;
    sendMail(message: any, subject?: string, receivers?: any[]): Promise<{
        status: boolean;
        message: string;
    }>;
    sendSingleEmail(message: any, receiver: any, subject?: string): Promise<{
        status: boolean;
        message: string;
    }>;
    sendError(message: any): Promise<void>;
    sendNotification(message: any): Promise<void>;
}
