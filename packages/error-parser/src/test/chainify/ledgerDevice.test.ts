import { FAKE_ERROR, getError, getErrorAsync } from '..';
import { LiqualityError } from '../../LiqualityErrors/LiqualityError';
import {
  getErrorParser,
  LedgerAppMismatchError,
  LedgerDappConflictError,
  LedgerDeviceLockedError,
  LedgerDeviceNotUpdatedError,
  LedgerDeviceSmartContractTransactionDisabledError,
  UserDeclinedError,
} from '../..';
import { ChainifyErrorParser } from '../../parsers';
import { LEDGER_ERRORS } from '../../parsers/Chainify';
import { LedgerErrorParser } from '../../parsers/Chainify/LedgerErrorParser';

describe('Ledger parser', () => {
  const parser = getErrorParser(ChainifyErrorParser);

  const errorMap = [
    [LEDGER_ERRORS.APP_MISMATCH_ERROR, LedgerAppMismatchError.name],
    [LEDGER_ERRORS.APP_NOT_SELECTED_ERROR, LedgerAppMismatchError.name],
    [LEDGER_ERRORS.DAPP_CONFLICT_ERROR, LedgerDappConflictError.name],
    [LEDGER_ERRORS.DEVICE_LOCKED_ERROR, LedgerDeviceLockedError.name],
    [LEDGER_ERRORS.NOT_UPDATED_ERROR, LedgerDeviceNotUpdatedError.name],
    [LEDGER_ERRORS.INVALID_DATA_ERROR, LedgerDeviceNotUpdatedError.name],
    [LEDGER_ERRORS.USER_REJECTED, UserDeclinedError.name],
    [LEDGER_ERRORS.SMART_CONTRACT_INTERACTION_DISABLED, LedgerDeviceSmartContractTransactionDisabledError.name],
  ];

  it('should not log anything to console', async () => {
    const logSpy = jest.spyOn(console, 'log');

    getError(() => {
      return parser.wrap(() => {
        throw FAKE_ERROR;
      }, null);
    });

    await getErrorAsync(async () => {
      return await parser.wrapAsync(async () => {
        throw FAKE_ERROR;
      }, null);
    });

    expect(logSpy).toHaveBeenCalledTimes(0);
  });

  it.each(errorMap)("should map '%s' => '%s'", async (sourceError, liqError) => {
    const validError = {
      message: sourceError,
      name: 'WalletError',
    };

    const error: LiqualityError = getError(() => {
      parser.wrap(() => {
        throw validError;
      }, null);
    });

    expect(error.name).toBe(liqError);
    expect(error.source).toBe(LedgerErrorParser.errorSource);
    expect(error.rawError).toBe(validError);

    const error1: LiqualityError = await getErrorAsync(async () => {
      await parser.wrapAsync(async () => {
        throw validError;
      }, null);
    });

    expect(error1.name).toBe(liqError);
    expect(error1.source).toBe(LedgerErrorParser.errorSource);
    expect(error1.rawError).toBe(validError);
  });
});
