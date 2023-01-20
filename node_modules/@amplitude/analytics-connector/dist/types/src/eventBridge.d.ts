export declare type AnalyticsEvent = {
    eventType: string;
    eventProperties?: Record<string, unknown>;
    userProperties?: Record<string, unknown>;
};
export declare type AnalyticsEventReceiver = (event: AnalyticsEvent) => void;
export interface EventBridge {
    logEvent(event: AnalyticsEvent): void;
    setEventReceiver(listener: AnalyticsEventReceiver): void;
}
export declare class EventBridgeImpl implements EventBridge {
    private receiver;
    private queue;
    logEvent(event: AnalyticsEvent): void;
    setEventReceiver(receiver: AnalyticsEventReceiver): void;
}
