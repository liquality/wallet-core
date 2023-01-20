export declare enum ReportTargets {
    Console = "Console",
    Discord = "Discord"
}
declare type JSONArray = Array<JSONValue>;
declare type JSONValue = string | number | boolean | JSONObject | JSONArray;
export declare type JSONObject = {
    [key: string]: JSONValue;
};
export declare type LiqualityErrorJSON = {
    name: string;
    source: string;
    translationKey: string;
    devMsg: {
        desc: string;
        data: JSONObject;
    };
    rawError: any;
    data: JSONObject | {
        errorId: string;
    };
    reported: boolean;
    reportable: boolean;
    stack: string;
};
export {};
