export = NowNodes;
declare class NowNodes {
    constructor({ token, timeout }: {
        token: any;
        timeout?: number | undefined;
    }, testnet?: boolean);
    baseURL: string;
    axios: any;
    getUtxos(address: any): Promise<any>;
}
