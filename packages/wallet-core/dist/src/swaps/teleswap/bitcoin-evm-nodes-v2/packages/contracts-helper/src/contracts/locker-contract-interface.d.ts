export = LockerContract;
declare class LockerContract extends EthereumBase {
    constructor(connectionInfo: any, contractAddress: any);
    contractAddress: any;
    contract: any;
    isLocker(lockingScript: any): Promise<any>;
    getLockerTargetAddress(lockingScript: any): Promise<any>;
    getLockerLockingScript(targetAddress: any): Promise<any>;
    getLockerPercentageFee(): Promise<any>;
    isValidLocker(lockingScript: any, targetAddress: any): Promise<any>;
    getLockerCapacity(targetAddress: any): Promise<any>;
    getLockerInfo(targetAddress: any): Promise<{
        lockerLockingScript: any;
        lockerRescueType: any;
        lockerRescueScript: any;
        TDTLockedAmount: any;
        nativeTokenLockedAmount: any;
        netMinted: any;
        slashingTeleBTCAmount: any;
        reservedNativeTokenForSlash: any;
        isLocker: any;
        isCandidate: any;
        isScriptHash: any;
        isActive: any;
    }>;
    requestToBecomeLocker({ lockerLockingScript, lockedTDTAmount, lockedNativeTokenAmount, lockerRescueType, lockerRescueScript, nonce, }: {
        lockerLockingScript: any;
        lockedTDTAmount: any;
        lockedNativeTokenAmount: any;
        lockerRescueType: any;
        lockerRescueScript: any;
        nonce?: undefined;
    }): Promise<any>;
    addCollateral({ targetAddress, nativeTokenAmount, nonce, }: {
        targetAddress?: any;
        nativeTokenAmount: any;
        nonce?: undefined;
    }): Promise<any>;
}
import EthereumBase = require("../ethereum-base");
