# Wallet Core

<pre>
 _       __      ____     __     ______              
| |     / /___ _/ / /__  / /_   / ____/___  ________ 
| | /| / / __ `/ / / _ \/ __/  / /   / __ \/ ___/ _ \
| |/ |/ / /_/ / / /  __/ /_   / /___/ /_/ / /  /  __/
|__/|__/\__,_/_/_/\___/\__/   \____/\____/_/   \___/ 
</pre>

![](https://img.shields.io/npm/v/@liquality/wallet-core?label=wallet-core)
![master](https://github.com/liquality/wallet-core/actions/workflows/build-test.yml/badge.svg?branch=master)

Wallet Core is a cryptocurrency wallet library in Typescript. It provides an abstracted interface that handles all the necessary internals of a muilti chain wallet. Featuring:

- State management
- Seed management and security
- Account management
- Blockchain communication under a common interface, powered by [Chainify](https://github.com/liquality/chainify)
- Retriving balances
- Sending transactions
- Intra and cross chain swaps supporting a host of decentralised exchanges - Liquality, Thorchain, Uniswap, 1inch, Sovryn, Astroport etc.
- Hardware wallet support

# Install

`npm install @liquality/wallet-core`

`yarn add @liquality/wallet-core`

## Usage

```typescript
import { setupWallet } from '@liquality/wallet-core';
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'; // Default options

const wallet = setupWallet({
  ...defaultOptions,
});

(async () => {
  await wallet.dispatch.createWallet({
    key: 'satoshi',
    mnemonic: 'never gonna give you up never gonna let you down never gonna',
    imported: true,
  });
  await wallet.dispatch.unlockWallet({ key: 'satoshi' });
  await wallet.dispatch.changeActiveNetwork({ network: 'mainnet' });
  console.log(wallet.state); // State will include default accounts
})();
```

## Options

See `WalletOptions` in [types](src/types.ts)

```typescript
  {
    initialState?: RootState; // The initial state of the wallet
    crypto: { // Implmenetation for platform specific crypto
      pbkdf2(password: string, salt: string, iterations: number, length: number, digest: string): Promise<string>;
      encrypt(value: string, key: string): Promise<any>;
      decrypt(value: any, key: string): Promise<any>;
    };
    // Handle notifications
    createNotification(notification: Notification): void;
    ...
  }
```

## Examples

- [Add Custom Token](https://github.com/liquality/wallet-core/blob/develop/packages/wallet-core/src/store/actions/addCustomToken.test.ts)
- [Export Private Key](https://github.com/liquality/wallet-core/blob/develop/packages/wallet-core/src/store/actions/exportPrivateKey.test.ts)
- [Send Transaction](https://github.com/liquality/wallet-core/blob/develop/packages/wallet-core/src/store/actions/sendTransaction.test.ts)
- [Update Fees](https://github.com/liquality/wallet-core/blob/develop/packages/wallet-core/src/store/actions/updateFees.test.ts)
- [Update Balance](https://github.com/liquality/wallet-core/blob/develop/packages/wallet-core/src/store/actions/updateBalances.test.ts)

## How to run tests

Integration tests are written in [Jest](https://jestjs.io/).

```angular2html
yarn test
```

## How to Contribute

### Swap Providers

**To add a new swap provider, you should clone this repo first and then use the develop branch as a base.**

1. Add the New Swap Provider type: https://github.com/liquality/wallet-core/blob/develop/packages/wallet-core/src/store/types.ts

2. Add the config or settings that you need inside the [build.config](https://github.com/liquality/wallet-core/blob/develop/packages/wallet-core/src/build.config.ts) file using the new type added in `SwapProviderType` enum, this should be inside the field `swapProviders` and then you can add different settings for `testnet` and `mainnet`. For example, if your swap provider will need to make some http calls and if you want to set the root url for it.

3. Create a new folder for your new provider inside `packages/wallet-core/src/swaps`, then add a new file named `info.json` whith a content like (you can check the other providers to get an example):

```
{
  "title": "Your title",
  "description": "Your description",
  "pros": [
    "Ethereum, Polygon, Binance Smart Chain, Avalanche",
    "Best exchange rates",
    "High liquidity",
    "Many pairs",
    "Fast"
  ],
  "cons": ["Slippage"],
  "fees": ["Additional aggregator fees", "Slippage (up to 0.6% in Liquality)"]
}

```

4. Add the swap provider info for your new provider, editing the file [/packages/wallet-core/src/swaps/utils.ts](https://github.com/liquality/wallet-core/blob/develop/packages/wallet-core/src/swaps/utils.ts).

- You should import the json file first `import yourProviderInfo from '../swaps/YOUR_PROVIDER/info.json';`
- Then add it to the `swapProviderInfo` variable

This will add metadata/info for your new provider to the available providers info/details.

5. Create a new file for your new provider inside `packages/wallet-core/src/swaps/YOUR_PROVIDER`. You can create any separated clases or files if you need. Please check the folder `packages/wallet-core/src/swaps/` and the other providers to get an example.

6. Implement the provider: your new provider should extend the class [SwapProvider](https://github.com/liquality/wallet-core/blob/develop/packages/wallet-core/src/swaps/SwapProvider.ts), it is an abtract class so you should implement at least these methods:

- \_getStatuses(): Record<string, SwapStatus>;
- \_txTypes(): Record<string, string | null>;
- \_fromTxType(): string | null;
- \_toTxType(): string | null; // replace with Enum
- \_totalSteps(): number;
- \_timelineDiagramSteps(): string[];

- getSupportedPairs({ network }: { network: Network }): Promise<PairData[]>;

- getMin(quoteRequest: QuoteRequest): Promise<BigNumber>;

- getQuote(quoteRequest: QuoteRequest): Promise<GetQuoteResult | null>;

- newSwap(swapRequest: SwapRequest): Promise<Partial<SwapHistoryItem>>;

- estimateFees(estimateFeeRequest: EstimateFeeRequest): Promise<EstimateFeeResponse | null>;

- performNextSwapAction(
  store: ActionContext,
  nextSwapAction: NextSwapActionRequest
  ): Promise<Partial<SwapHistoryItem> | undefined>;

- waitForSwapConfirmations(
  \_nextSwapActionRequest: NextSwapActionRequest
  ): Promise<ActionStatus | undefined> {
  return;
  }

7. Add the new provider to the list of providers [/packages/wallet-core/src/factory/swap/index.ts]https://github.com/liquality/wallet-core/blob/develop/packages/wallet-core/src/factory/swap/index.ts) and map it with the `SwapProviderType` enum. This will add the provider to the available providers when the user wants to swap.

8. Test using the local wallet environment:

- Clone the wallet repo and use the develop branch [https://github.com/liquality/wallet](https://github.com/liquality/wallet)
- Select the node version using nvm and install all dependencies. Run `nvm use && yarn`
- Link your local wallet-core package. Run `yarn link ../wallet-core --all`.
- Open the package.json file and replace the `portal` protocol inside the `resolutions` field at the end of the file, to use `link` (instead of `portal:...`, should be `link:`) then run `yarn`
- To run the wallet just run `yarn dev`
