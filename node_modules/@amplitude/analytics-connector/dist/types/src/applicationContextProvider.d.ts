export declare type ApplicationContext = {
    versionName?: string;
    language?: string;
    platform?: string;
    os?: string;
    deviceModel?: string;
};
export interface ApplicationContextProvider {
    versionName: string;
    getApplicationContext(): ApplicationContext;
}
export declare class ApplicationContextProviderImpl implements ApplicationContextProvider {
    private readonly ua;
    versionName: string;
    getApplicationContext(): ApplicationContext;
}
