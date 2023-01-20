import { LiqualityError } from '../../LiqualityErrors/LiqualityError';
import { ErrorParser } from '../ErrorParser';
import { LifiQuoteError, LifiQuoteErrorParserDataType } from '.';
export declare class LifiQuoteErrorParser extends ErrorParser<LifiQuoteError, LifiQuoteErrorParserDataType> {
    static readonly errorSource = "LifiQuoteAPI";
    protected _parseError(error: LifiQuoteError, data: LifiQuoteErrorParserDataType): LiqualityError;
}
