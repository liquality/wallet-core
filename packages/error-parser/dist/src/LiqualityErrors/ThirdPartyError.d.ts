import { LiqualityError, UserActivity } from './LiqualityError';
export declare class ThirdPartyError extends LiqualityError<ThirdPartyErrorContext> {
    reportable: boolean;
    constructor(data?: ThirdPartyErrorContext);
    setTranslationKey(data?: ThirdPartyErrorContext): void;
}
export declare type ThirdPartyErrorContext = {
    activity: UserActivity;
};
