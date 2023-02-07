import { LiqualityError } from '../LiqualityErrors/LiqualityError';
export declare abstract class ErrorParser<SourceError, DataType> {
    static readonly errorSource: string;
    protected abstract _parseError(error: SourceError, data: DataType): LiqualityError;
    wrap<F extends (...args: Array<any>) => any>(func: F, data: DataType): ReturnType<F> | undefined;
    wrapAsync<F extends (...args: Array<any>) => Promise<any>>(func: F, data: DataType): Promise<ReturnType<F> | undefined>;
    parseError(error: SourceError, data: DataType): LiqualityError<import("../types").JSONObject> | (SourceError & LiqualityError<any>);
}
