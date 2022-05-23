import {getFeeLabel, getSendFee} from "./fees";

test('should be able to validate getSendFee', async () => {
  const result = getSendFee('ETH', 1);
  expect(result).not.toBeUndefined()
});

test('should be able to validate getFeeLabel', async () => {
  let result = getFeeLabel('test');
  expect(result).toBe('')

  result = getFeeLabel('slow');
  expect(result).toBe('Slow')
});
