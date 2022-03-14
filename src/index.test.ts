import { wallet } from './index';

it('Initial State', () => {
  expect(wallet.state.rskLegacyDerivation).toBe(false);
});
