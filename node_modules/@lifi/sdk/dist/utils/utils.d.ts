import { TransactionReceipt } from '@ethersproject/providers';
import { Token } from '@lifi/types';
import BigNumber from 'bignumber.js';
import { Signer } from 'ethers';
import { ChainId, Step } from '../types';
export declare const deepClone: <T>(src: T) => T;
export declare const sleep: (mills: number) => Promise<undefined>;
export declare const personalizeStep: (signer: Signer, step: Step) => Promise<Step>;
export declare const splitListIntoChunks: <T>(list: T[], chunkSize: number) => T[][];
export declare const formatTokenAmountOnly: (token: Token, amount: string | BigNumber | undefined) => string;
/**
 * Repeatedly calls a given asynchronous function until it resolves with a value
 * @param toRepeat The function that should be repeated
 * @param timeout The timeout in milliseconds between retries, defaults to 5000
 * @returns The result of the toRepeat function
 */
export declare const repeatUntilDone: <T>(toRepeat: () => Promise<T | undefined>, timeout?: number) => Promise<T>;
/**
 * Loads a transaction receipt using the rpc for the given chain id
 * @param chainId The chain id where the transaction should be loaded from
 * @param txHash The hash of the transaction
 * @returns TransactionReceipt
 */
export declare const loadTransactionReceipt: (chainId: ChainId, txHash: string) => Promise<TransactionReceipt>;
export declare const isZeroAddress: (address: string) => boolean;
export declare const isNativeTokenAddress: (address: string) => boolean;
