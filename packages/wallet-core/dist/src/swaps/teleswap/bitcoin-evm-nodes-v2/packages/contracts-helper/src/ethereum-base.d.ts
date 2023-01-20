export = EthereumBase;
declare class EthereumBase {
    static extractEventTxInfo(rawEvent: any): {
        blockNumber: any;
        logIndex: any;
        transactionHash: any;
        eventName: any;
        signature: any;
    };
    constructor({ connectionInfo, web3Eth }: {
        connectionInfo: {
            url: string;
            headers: object;
        };
        web3Eth: typeof Web3Eth;
    });
    web3Eth: typeof Web3Eth;
    isAccountInitialized: boolean;
    currentAccount: any;
    hdWalletPath: any;
    setProviderUsingUrl({ url, headers }: {
        url: any;
        headers?: undefined;
    }): void;
    setWssProviderUsingUrl({ url, headers }: {
        url: any;
        headers?: undefined;
    }, options?: {
        timeout: number;
        reconnect: {
            auto: boolean;
            delay: number;
            maxAttempts: number;
            onTimeout: boolean;
        };
        clientConfig: {
            keepalive: boolean;
            keepaliveInterval: number;
            maxReceivedFrameSize: number;
            maxReceivedMessageSize: number;
        };
    }): void;
    setHttpProviderUsingUrl({ url, headers }: {
        url: any;
        headers?: undefined;
    }): void;
    setWeb3EthProvider(provider: any): void;
    setCurrentAccount(address: any): void;
    addAccountByPrivateKey(privateKeyHex: any): any;
    addAccountByMnemonic({ mnemonic, mnemonicPassword, index, walletNumber }: {
        mnemonic: any;
        mnemonicPassword?: string | undefined;
        index?: number | undefined;
        walletNumber?: number | undefined;
    }): any;
    getLatestBlock(): Promise<any>;
    getLatestBlockNumber(): Promise<any>;
    getCurrentNonce(address: any, revertIfAnyPendingTxExist?: boolean): Promise<any>;
    getNumberOfConfirmedTransactions(address: any): Promise<any>;
    getNumberOfMemPoolTransactions(address: any): Promise<number>;
    checkCurrentAccountBalance(warningAmount: number | undefined, errorAmount: number | undefined, handleError: any, sendNotificationToAdmin: any): Promise<boolean>;
    checkCurrentAccountBalanceForContractCall({ maximumGasLimit, NumberOfCallForWarning, NumberOfCallForError, }: {
        maximumGasLimit?: number | undefined;
        NumberOfCallForWarning?: number | undefined;
        NumberOfCallForError?: number | undefined;
    }): Promise<boolean>;
}
import Web3Eth = require("web3-eth");
