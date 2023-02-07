import RPC = require("./rpc");
import ApiProviders = require("./api");
export function getRpcProvider(connectionInfo: any): any;
export function getApiProvider(connectionInfo: {
    provider: string;
    token: string | null;
}, networkName: string): any;
export { RPC, ApiProviders };
