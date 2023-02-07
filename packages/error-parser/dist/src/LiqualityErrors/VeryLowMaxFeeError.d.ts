import { LiqualityError } from './LiqualityError';
export declare class VeryLowMaxFeeError extends LiqualityError<VeryLowMaxFeeErrorContext> {
    constructor(data?: VeryLowMaxFeeErrorContext);
}
export declare type VeryLowMaxFeeErrorContext = {
    maxFeePerGas: string;
};
