import { LiqualityError } from './LiqualityError';
export declare class VeryHighMaxFeeWarning extends LiqualityError<VeryHighMaxFeeWarningContext> {
    constructor(data?: VeryHighMaxFeeWarningContext);
}
export declare type VeryHighMaxFeeWarningContext = {
    maxFeePerGas: string;
};
