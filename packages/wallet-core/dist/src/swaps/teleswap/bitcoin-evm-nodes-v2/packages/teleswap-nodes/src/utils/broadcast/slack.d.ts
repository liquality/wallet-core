export = Slack;
declare class Slack {
    constructor({ channelWebHook, channelName, defaultTitle }: {
        channelWebHook: any;
        channelName: any;
        defaultTitle?: string | undefined;
    }, enabled?: boolean);
    enabled: boolean;
    channelWebHook: any;
    channelName: any;
    defaultTitle: string;
    PRIORITY: {
        NOT_IMPORTANT: number;
        NORMAL: number;
        WARNING: number;
        HIGH: number;
        CRITICAL: number;
    };
    sendMessageToSlackChannel({ message, title, priority, isError, }: {
        message: any;
        title?: string | undefined;
        priority?: number | undefined;
        isError?: boolean | undefined;
    }): Promise<{
        status: boolean;
        message: string;
    }>;
}
