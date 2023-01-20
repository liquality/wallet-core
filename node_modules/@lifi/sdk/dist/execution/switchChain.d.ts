import { Step } from '@lifi/types';
import { Signer } from 'ethers';
import { SwitchChainHook } from '../types';
import { StatusManager } from './StatusManager';
/**
 * This method checks whether the signer is configured for the correct chain.
 * If yes it returns the signer.
 * If no and if user interaction is allowed it triggers the switchChainHook. If no user interaction is allowed it aborts.
 *
 * @param signer
 * @param statusManager
 * @param step
 * @param switchChainHook
 * @param allowUserInteraction
 */
export declare const switchChain: (signer: Signer, statusManager: StatusManager, step: Step, switchChainHook: SwitchChainHook, allowUserInteraction: boolean) => Promise<Signer | undefined>;
