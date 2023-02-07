import { LiqualityError } from '../../LiqualityErrors';
import { ErrorParser } from '../ErrorParser';
export declare class ThorchainAPIErrorParser extends ErrorParser<Error, ThorchainAPIErrorParserDataType> {
    static readonly errorSource = "Thorchain API";
    protected _parseError(error: Error, data?: ThorchainAPIErrorParserDataType): LiqualityError;
}
export declare type ThorchainAPIErrorParserDataType = {
    txHash?: string;
};
