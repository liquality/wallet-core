// An Error source can refer to endpoint(s)(Rpc or Api), a package/package function(s), Contract/Contract function(s)
// It's just a database of functionalities consumed by Liquality whether they are external or internal so long as they do not themselves use the liquality Error Parser package

export enum ReportTargets {
  Console = 'Console',
  Discord = 'Discord',
}
export interface UserErrorMessage {
  cause: string;
  suggestions: Array<string>;
}

type JSONArray = Array<JSONValue>;
type JSONValue = string | number | boolean | JSONObject | JSONArray;
export type JSONObject = { [key: string]: JSONValue };

export type LiqualityErrorJSON = {
  name: string;
  source: string;
  causeKey: string;
  suggestionKey: string;
  devMsg: { desc: string; data: JSONObject };
  rawError: any;
  data: JSONObject | { errorId: string };
  reported: boolean;
  stack: string;
};