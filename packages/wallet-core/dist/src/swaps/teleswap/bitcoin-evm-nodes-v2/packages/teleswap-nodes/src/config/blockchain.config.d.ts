export namespace service {
    const name: any;
    namespace teleporter {
        const teleportEnabled: any;
        const slashUserEnabled: any;
        const slashLockerEnabled: any;
        const lendingEnabled: any;
        const lockers: any;
    }
}
export namespace sourceNetwork {
    const name_1: any;
    export { name_1 as name };
    export namespace connection {
        namespace api {
            const enabled: boolean;
            const provider: any;
            const token: any;
        }
        namespace rpc {
            const enabled_1: any;
            export { enabled_1 as enabled };
            export const url: any;
            export const auth: any;
            export const headers: any;
        }
    }
    export const options: {};
}
export namespace targetNetwork {
    const name_2: any;
    export { name_2 as name };
    export const chainId: any;
    export namespace connection_1 {
        namespace web3 {
            const url_1: any;
            export { url_1 as url };
            const headers_1: any;
            export { headers_1 as headers };
        }
    }
    export { connection_1 as connection };
    const options_1: {};
    export { options_1 as options };
}
export namespace account {
    const mnemonic: any;
    const index: any;
}
export const contracts: any;
export const tokens: any;
