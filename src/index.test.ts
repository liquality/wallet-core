import { wallet } from './index';

it('Initial State', () => {
  expect(wallet.state.count).toBe(0);
});
