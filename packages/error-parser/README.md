# Error Parser

## General Information

Error Parser is an Error formatting and reporting Library for Liquality. It's an effort to understand and produce User-friendly messages for the different errors that arise either internally or as a result of calls made to external endpoints/packages. Here are some important points:

1. **Parsers**: The Error parser contains parsers, one for each external endpoint or package that could throw. Each Parser takes in an error (let's call it raw error) and returns a Liquality Error.

2. **Liquality Error:** A Liquality is simply an extension of JS Error. It has a message for the user and for developers/QA so everyone is carried along (See [here](src/LiqualityErrors/LiqualityError.ts) for the full structure of a Liquality Error). There are really three(3) broad categories of Liquality Errors: Internal errors, third party errors and input errors.

   - _Internal errors_ are exceptions traceable to mistakes in our code.
   - _Third party errors_ are exceptions from external sources.
   - _Input errors_ are errors arising from user provided values. This category makes for the bulk of Liquality error types.
     (See [Here](src/LiqualityErrors/index.ts) for a full list of available liquality errors).

3. **User Message:** The actual user message is not contained in the Liquality Error. Rather there are keys and data which needs to be passed through a translation library to get the actual message in the locale of the user. There are actually two keys for the user message, namely, causeKey and suggestionKey. While causeKey is used by the translator to get the cause of the error, the suggestionKey is used to get a list of <SUGGESTION_DELIMETER> seperated list of things the user can try. The <SUGGESTION_DELIMETER> is chosen such that no language has a meaningful use for it. This is useful should you want to split the suggestions string into an array of suggestions.

4. **Custom Internal Errors:** The Error Parser package contains a list of [reusable Custom Errors](src/LiqualityErrors/customErrors.ts) that can be used anywhere there is a need to throw an Internal Error.

5. **Error Reporting:**
   - The error reporting is done seamlessly without the developer's intervention. The error reporting function is automatically invoked [after parsing an external](https://github.com/liquality/wallet-core/blob/911aa835d15782c33811a7b3b03d7766d4c52d93/packages/error-parser/src/parsers/ErrorParser.ts#L32) error and [after creating a custom error](https://github.com/liquality/wallet-core/blob/8f8b6cb5dae62a791c2608a6a21f85e3132c63ff/packages/error-parser/src/utils/index.ts#L17).
   - The Error parser package relies on two env variables
     - `VUE_APP_REPORT_TARGETS` listing a comma-separated list of destinations where error reports should be sent(`Console` and `Discord` are currently supported) and
     - `VUE_APP_DISCORD_WEBHOOK` to hold the discord webhook (if necessary)
   - Error Reporting is non blocking and fails silently (see [example](https://github.com/liquality/wallet-core/blob/d1f5e332c97d2b4965f8fc4fd450eed62b78e0cf/packages/error-parser/src/reporters/discord.ts#L10))

## How to Install

`npm install @liquality/error-parser`

`yarn add @liquality/error-parser`

## How to Create a New Parser

1. _Extend the [base Error Parser](src/parsers/ErrorParser.ts)_.
   The primary function in the Error Parser is the \_parseError function. This function should have a way to map each raw error to the appropriate
   Liquality Error.

See [OneInchApproveAPI](src/parsers/OneInchAPI/ApproveErrorParser.ts) Error Parser as an example.

1. _Write a test for the parser_.
   The test should verify that the source error should map to the appropriate
   Liquality Error. See [OneInchApproveAPI Error Parser test](src/test/oneInch/approveAPI.test.ts) as an example.

## How to use

The following Code snippets present four(4) different ways to use the error parser package

- ### Wrapping a call

  You can use `wrap` or `wrapAsync` to wrap sync and async calls respectively. When a call is wrapped any error from that call is rethrown as a Liquality error and also reported.

  ```typescript

  import { getParser, OneInchApproveErrorParser } from '@liquality/error-parser’;

  // Instead of the snippet below
  // const callData = await this._httpClient.nodeGet(`/${chainId}/approve/transaction`, {
  //  tokenAddress: cryptoassets[quote.from].contractAddress,
  //  amount: inputAmount.toString(),
  // });

  // We have this ...
  const parser = getParser(OneInchApproveErrorParser);
  const callData = await parser.wrapAsync( async () => {
  await this._httpClient.nodeGet(`/${chainId}/approve/transaction`, {
  tokenAddress: cryptoassets[quote.from].contractAddress,
  amount: inputAmount.toString(),
  });
  },
  // Add Optional object literal here... containing any data that may be used to make error message more helpful
  );
  ```

- ### Parsing an error

  You can parse an error returned from a call instead of wrapping the call.

  ```typescript
  import { ChainifyErrorParser, CUSTOM_ERRORS, getErrorParser } from '@liquality/error-parser';

  const parser = getErrorParser(ChainifyErrorParser);
  try {
    const result = await target();
    return result;
  } catch (e) {
    const liqualityError = parser.parseError(e, null);
    throw liqualityError;
  }
  ```

- ### Throwing a Custom Internal Error

  You can throw a custom internal error by using one of the standard custom errors to express what went wrong. Rather than doing new InternalError(...) we use createInternalError helper so we can also report the error after creation before returning.

  ```typescript
  import { CUSTOM_ERRORS, createInternalError } from '@liquality/error-parser';

  throw createInternalError(CUSTOM_ERRORS.NotFound.Account(accountId));
  ```

- ### How to get translations

  The error translation files for Mobile is separated from that of Wallet Extension sake of possibility of copy differences. The translations follow the format of [i18n-js translation library](https://www.npmjs.com/package/i18n-js). Each error has a plain translation and a placeholder translation. Placeholder translation interpolates data in the message to make it more information while plain translation is a fallback translation in the event that no data is provided (See [here](src/LiqualityErrors/translations) to see the error translation copy) Here is how to get the translations from Error Parser:

  ```typescript
  import { TRANSLATIONS } from '@liquality/error-parser';

  errorTranslationsForWalletExtension = TRANSLATIONS.walletExtension; // {cb, en, es, ph, pt, zh}
  errorTranslationsForMobile = TRANSLATIONS.walletExtension; // {cb, en, es, ph, pt, zh}
  ```

## How to run tests

```angular2html
yarn test
```
