import { JSONObject } from '../types';
export declare abstract class LiqualityError<Context extends JSONObject = JSONObject> extends Error {
    source: string;
    translationKey: string;
    devMsg: {
        desc: string;
        data: JSONObject;
    };
    rawError: any;
    data: Context | {
        errorId: string;
    };
    reported: boolean;
    reportable: boolean;
    constructor(name: string, data?: Context);
    setTranslationKey(data?: Context): void;
    toString(): string;
}
export declare enum UserActivity {
    SWAP = "SWAP",
    UNKNOWN = "UNKNOWN"
}
