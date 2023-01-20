import { ApplicationContextProviderImpl } from './applicationContextProvider';
import { EventBridgeImpl } from './eventBridge';
import { IdentityStoreImpl } from './identityStore';
export declare class AnalyticsConnector {
    readonly identityStore: IdentityStoreImpl;
    readonly eventBridge: EventBridgeImpl;
    readonly applicationContextProvider: ApplicationContextProviderImpl;
    static getInstance(instanceName: string): AnalyticsConnector;
}
