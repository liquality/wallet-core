import { LiqualityError } from './LiqualityError';
export declare class HighInputAmountError extends LiqualityError<HighInputAmountErrorContext> {
    constructor(data?: HighInputAmountErrorContext);
    setTranslationKey(): void;
}
export declare type HighInputAmountErrorContext = {
    expectedMaximum: string;
    assetCode: string;
};
