import { registerWallet } from './register.js';
import { LiqualityWallet } from './wallet.js';
import type { Liquality } from './window.js';

export function initialize(Liquality: Liquality): void {
  registerWallet(new LiqualityWallet(Liquality));
}
