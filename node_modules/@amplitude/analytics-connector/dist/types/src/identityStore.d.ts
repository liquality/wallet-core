export declare type Identity = {
    userId?: string;
    deviceId?: string;
    userProperties?: Record<string, unknown>;
};
export declare type IdentityListener = (identity: Identity) => void;
export interface IdentityStore {
    editIdentity(): IdentityEditor;
    getIdentity(): Identity;
    setIdentity(identity: Identity): void;
    addIdentityListener(listener: IdentityListener): void;
    removeIdentityListener(listener: IdentityListener): void;
}
export interface IdentityEditor {
    setUserId(userId: string): IdentityEditor;
    setDeviceId(deviceId: string): IdentityEditor;
    setUserProperties(userProperties: Record<string, unknown>): IdentityEditor;
    updateUserProperties(actions: Record<string, Record<string, unknown>>): IdentityEditor;
    commit(): void;
}
export declare class IdentityStoreImpl implements IdentityStore {
    private identity;
    private listeners;
    editIdentity(): IdentityEditor;
    getIdentity(): Identity;
    setIdentity(identity: Identity): void;
    addIdentityListener(listener: IdentityListener): void;
    removeIdentityListener(listener: IdentityListener): void;
}
