import { LiqualityError } from './LiqualityError';
export declare class InsufficientGasFeeError extends LiqualityError<InsufficientGasFeeErrorContext> {
    constructor(data?: InsufficientGasFeeErrorContext);
}
export declare type InsufficientGasFeeErrorContext = {
    currency: string;
    gasFee: string;
};
