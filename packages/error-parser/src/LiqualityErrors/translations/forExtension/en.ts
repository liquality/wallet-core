import { SUGGESTION_DELIMETER } from '..';
import {
  HighInputAmountError,
  InsufficientFundsError,
  InsufficientGasFeeError,
  InsufficientInputAmountError,
  InsufficientLiquidityError,
  InternalError,
  LedgerDeviceConnectionError,
  LowSpeedupFeeError,
  NoActiveWalletError,
  NoMaxFeeError,
  NoTipError,
  PairNotSupportedError,
  PasswordError,
  QuoteExpiredError,
  SlippageTooHighError,
  ThirdPartyError,
  UnknownError,
  VeryHighMaxFeeWarning,
  VeryHighTipWarning,
  VeryLowMaxFeeError,
  VeryLowTipError,
  WalletLockedError,
} from '../../../LiqualityErrors';
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
        'Sorry, your swap of %{amount} from %{from} to %{to} could not be completed due to insufficient liquidity',
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
  [SlippageTooHighError.name]: {
    [PLACEHOLDER]: {
      [CAUSE]:
        'Slippage is too high. You expect %{expectedAmount} but you are going to receive %{actualAmount} %{currency}',
      [SUGGESTIONS]: 'Try again',
    },
    [PLAIN]: {
      [CAUSE]: 'Slippage is too high',
      [SUGGESTIONS]: 'Try again',
    },
  },
  [QuoteExpiredError.name]: {
    [PLAIN]: {
      [CAUSE]: 'The quote has expired',
      [SUGGESTIONS]: 'Try again',
    },
  },
  [WalletLockedError.name]: {
    [PLAIN]: {
      [CAUSE]: 'Wallet is locked',
      [SUGGESTIONS]: 'Unlock the wallet first',
    },
  },
  [NoActiveWalletError.name]: {
    [PLAIN]: {
      [CAUSE]: 'No active wallet found',
      [SUGGESTIONS]: 'Create a wallet first',
    },
  },
  [LedgerDeviceConnectionError.name]: {
    [PLAIN]: {
      [CAUSE]: 'Ledger device not connected or not unlocked',
      [SUGGESTIONS]: '',
    },
  },
  [PasswordError.name]: {
    [PLAIN]: {
      [CAUSE]: 'Incorrect Password',
      [SUGGESTIONS]: 'Try Again (Password should have 8 or more characters)',
    },
  },
  [NoTipError.name]: {
    [PLAIN]: {
      [CAUSE]: 'Miner tip must be greater than 0 GWEI',
      [SUGGESTIONS]: '',
    },
  },
  [VeryLowTipError.name]: {
    [PLAIN]: {
      [CAUSE]: 'Miner tip is extremely low and the transaction could fail',
      [SUGGESTIONS]: "Use 'Low'",
    },
  },
  [VeryHighTipWarning.name]: {
    [PLAIN]: {
      [CAUSE]: 'Miner tip is higher than necessary. You may pay more than needed',
      [SUGGESTIONS]: 'c',
    },
  },
  [NoMaxFeeError.name]: {
    [PLAIN]: {
      [CAUSE]: 'Max fee must be greater than 0 GWEI',
      [SUGGESTIONS]: '',
    },
  },
  [VeryLowMaxFeeError.name]: {
    [PLACEHOLDER]: {
      [CAUSE]: 'Max fee too low. Must be > %{maxFeePerGas} GWEI (Base Fee plus Miner Tip)',
      [SUGGESTIONS]: '',
    },
    [PLAIN]: {
      [CAUSE]: 'Max fee too low. Must be > (Base Fee plus Miner Tip)',
      [SUGGESTIONS]: '',
    },
  },
  [VeryHighMaxFeeWarning.name]: {
    [PLACEHOLDER]: {
      [CAUSE]: 'Max fee is higher than necessary %{maxFeePerGas} GWEI (Base Fee plus Miner Tip)',
      [SUGGESTIONS]: "Review  your maximum 'New Fee Total'",
    },
    [PLAIN]: {
      [CAUSE]: 'Max fee is higher than necessary',
      [SUGGESTIONS]: "Review  your maximum 'New Fee Total'",
    },
  },
};
