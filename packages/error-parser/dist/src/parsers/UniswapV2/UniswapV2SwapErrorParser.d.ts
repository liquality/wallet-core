import { LiqualityError } from '../../LiqualityErrors';
import { ErrorParser } from '../ErrorParser';
export declare class UniswapV2SwapErroParser extends ErrorParser<Error, UniswapV2SwapErrorParserDataType> {
    static readonly errorSource = "UniswapV2";
    protected _parseError(error: Error, data?: UniswapV2SwapErrorParserDataType): LiqualityError;
}
export declare type UniswapV2SwapErrorParserDataType = null;
