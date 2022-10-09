import { SUGGESTION_DELIMETER } from '..';
import HighInputAmountError from '../../HighInputAmountError';
import InsufficientFundsError from '../../InsufficientFundsError';
import InsufficientGasFeeError from '../../InsufficientGasFeeError';
import InsufficientInputAmountError from '../../InsufficientInputAmountError';
import InsufficientLiquidityError from '../../InsufficientLiquidityError';
import InternalError from '../../InternalError';
import LowSpeedupFeeError from '../../LowSpeedupFeeError';
import PairNotSupportedError from '../../PairNotSupportedError';
import ThirdPartyError from '../../ThirdPartyError';
import UnknownError from '../../UnknownError';
import { CAUSE, PLACEHOLDER, PLAIN, SUGGESTIONS, SWAP_ACTIVITY, UNKNOWN_ACTIVITY } from '../translationKeys';

export const en = {
  [HighInputAmountError.name]: {
    [PLACEHOLDER]: {
      [CAUSE]: 'Input amount is too high, expected maximum amount is  %{expectedMaximum} %{assetCode} ',
      [SUGGESTIONS]: 'Please decrease input amount',
    },
    [PLAIN]: {
      [CAUSE]: 'Input amount is too high',
      [SUGGESTIONS]: 'Please decrease input amount',
    },
  },
  [InsufficientFundsError.name]: {
    [PLACEHOLDER]: {
      [CAUSE]: 'Insufficient funds: Sorry, You have %{availAmt}%{currency} but you need %{neededAmt}%{currency}',
      [SUGGESTIONS]: '',
    },
    [PLAIN]: {
      [CAUSE]: 'Insufficient funds',
      [SUGGESTIONS]: '',
    },
  },
  [InsufficientGasFeeError.name]: {
    [PLACEHOLDER]: {
      [CAUSE]:
        'Sorry, you do not have enough %{currency} to cover transaction fee. You need a buffer of atleast %{gasFee}%{currency} to be fine',
      [SUGGESTIONS]: '',
    },
    [PLAIN]: {
      [CAUSE]: 'Sorry, you do not have enough funds to cover transaction fee',
      [SUGGESTIONS]: '',
    },
  },
  [InsufficientInputAmountError.name]: {
    [PLACEHOLDER]: {
      [CAUSE]: 'Input amount is too low, expected minimum amount is  %{expectedMinimum} %{assetCode} ',
      [SUGGESTIONS]: 'Please increase input amount',
    },
    [PLAIN]: {
      [CAUSE]: 'Input amount is too low',
      [SUGGESTIONS]: 'Please increase input amount',
    },
  },
  [InsufficientLiquidityError.name]: {
    [PLACEHOLDER]: {
      [CAUSE]:
        '`Sorry, your swap of %{amount} from %{from} to %{to} could not be completed due to insufficient liquidity',
      [SUGGESTIONS]: [
        'Reduce your swap amount',
        'Try a different swap pair',
        'Select a different swap provider from our list of swap providers',
        'Try again at a later time',
      ].join(SUGGESTION_DELIMETER),
    },
    [PLAIN]: {
      [CAUSE]: 'Sorry, your swap could not be completed due to insufficient liquidity',
      [SUGGESTIONS]: [
        'Reduce your swap amount',
        'Try a different swap pair',
        'Select a different swap provider from our list of swap providers',
        'Try again at a later time',
      ].join(SUGGESTION_DELIMETER),
    },
  },
  [InternalError.name]: {
    [PLACEHOLDER]: {
      [CAUSE]: '',
      [SUGGESTIONS]: '',
    },
    [PLAIN]: {
      [CAUSE]: 'Sorry, something went wrong while processing this transaction.',
      [SUGGESTIONS]: [
        'Try again at a later time',
        'If it persist, please contact support on discord with errorId: %{errorId}',
      ].join(SUGGESTION_DELIMETER),
    },
  },
  [LowSpeedupFeeError.name]: {
    [PLACEHOLDER]: {
      [CAUSE]: '',
      [SUGGESTIONS]: '',
    },
    [PLAIN]: {
      [CAUSE]: 'Replacement Fee to speed up transaction is less than or equals the old fee.',
      [SUGGESTIONS]: 'Try Speeding up transaction with a higher fee',
    },
  },
  [PairNotSupportedError.name]: {
    [PLACEHOLDER]: {
      [CAUSE]: 'Sorry, swap provider does not support selected pair %{from}/%{to}',
      [SUGGESTIONS]: 'Select a different swap provider',
    },
    [PLAIN]: {
      [CAUSE]: 'Sorry, swap provider does not support selected pair',
      [SUGGESTIONS]: 'Select a different swap provider',
    },
  },
  [ThirdPartyError.name]: {
    [PLACEHOLDER]: {
      [CAUSE]: '',
      [SUGGESTIONS]: '',
    },
    [PLAIN]: {
      [CAUSE]: 'Sorry, something went wrong in a third party service we use in processing this transaction',
      [SUGGESTIONS]: {
        [SWAP_ACTIVITY]: ['Select a different swap provider', 'Try again at a later time'].join(SUGGESTION_DELIMETER),
        [UNKNOWN_ACTIVITY]: 'Try again at a later time',
      },
    },
  },
  [UnknownError.name]: {
    [PLACEHOLDER]: {
      [CAUSE]: '',
      [SUGGESTIONS]: '',
    },
    [PLAIN]: {
      [CAUSE]: 'Sorry, something went wrong while processing this transaction',
      [SUGGESTIONS]: '',
    },
  },
};
