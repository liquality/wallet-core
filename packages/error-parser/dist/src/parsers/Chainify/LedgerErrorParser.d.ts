import { LiqualityError } from '../../LiqualityErrors';
import { ErrorParser } from '../ErrorParser';
export declare class LedgerErrorParser extends ErrorParser<Error, LedgerParserDataType> {
    static readonly errorSource = "LedgerDevice";
    protected _parseError(error: Error): LiqualityError;
}
export declare type LedgerParserDataType = null;
