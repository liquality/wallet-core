/* eslint-disable @typescript-eslint/no-explicit-any */
import { reportLiqualityError } from '../reporters';
import { LiqualityError } from '../LiqualityErrors/LiqualityError';

export abstract class ErrorParser<SourceError, DataType> {
  public static readonly errorSource: string;
  protected abstract _parseError(error: SourceError, data: DataType): LiqualityError;

  wrap<F extends (...args: Array<any>) => any>(func: F, data: DataType): ReturnType<F> | undefined {
    try {
      return func();
    } catch (error) {
      const liqualityError = this.parseError(error, data);
      reportLiqualityError(liqualityError);
      throw liqualityError;
    }
  }
  async wrapAsync<F extends (...args: Array<any>) => Promise<any>>(
    func: F,
    data: DataType
  ): Promise<ReturnType<F> | undefined> {
    try {
      return await func();
    } catch (error) {
      const liqualityError = this.parseError(error, data);
      reportLiqualityError(liqualityError);
      throw liqualityError;
    }
  }

  parseError(error: SourceError, data: DataType) {
    const parsedError = this._parseError(error, data);
    return parsedError;
  }
}
