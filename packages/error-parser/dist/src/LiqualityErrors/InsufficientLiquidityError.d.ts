import { LiqualityError } from './LiqualityError';
export declare class InsufficientLiquidityError extends LiqualityError<InsufficientLiquidityErrorContext> {
    constructor(data?: InsufficientLiquidityErrorContext);
    setTranslationKey(): void;
}
export declare type InsufficientLiquidityErrorContext = {
    from: string;
    to: string;
    amount: string;
};
