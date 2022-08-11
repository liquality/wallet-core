import { getFeeLabel, getSendFee, getTxFee } from './fees';

describe('fees tests', () => {
  test('should be able to validate ETH getSendFee', async () => {
    const result = getSendFee('ETH', 1);
    expect(result).not.toBeUndefined();
  });

  test('should be able to validate BTC getSendFee', async () => {
    const result = getSendFee('BTC', 1);
    expect(result).not.toBeUndefined();
  });

  test('should be able to validate getFeeLabel', async () => {
    let result = getFeeLabel('test');
    expect(result).toBe('');

    result = getFeeLabel('slow');
    expect(result).toBe('Slow');

    result = getFeeLabel('Average');
    expect(result).toBe('Avg');
  });

  test('should be able to validate getTxFee', async () => {
    let result = getTxFee(
      {
        ETH: 1,
      },
      'ETH',
      1
    );
    expect(result).not.toBeUndefined();
    expect(result).not.toBe(NaN);

    result = getTxFee(
      {
        DAI: 1,
      },
      'DAI',
      1
    );
    expect(result).not.toBeUndefined();
    expect(result).not.toBe(NaN);

    result = getTxFee(
      {
        UST: 1,
      },
      'UST',
      1
    );
    expect(result).not.toBeUndefined();
    expect(result).not.toBe(NaN);
  });
});
