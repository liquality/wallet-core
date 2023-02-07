export interface IGasLimits {
    send: {
        native: number;
        nonNative?: number;
    };
    sendL1?: {
        native: number;
        nonNative?: number;
    };
}
export declare type GasLimitsType = keyof IGasLimits;
