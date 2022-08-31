// import cryptoassets from 'src/utils/cryptoassets';
import cryptoassets from '../utils/cryptoassets';

import { getUNSKey, UNSResolver } from './uns';

describe('chainToUNSKey', () => {
  it('returns correct key for bitcoin', () => {
    const bitcoin = cryptoassets['BTC'];
    expect(getUNSKey(bitcoin)).toBe('crypto.BTC.address');
  });
  it('returns correct key for polygon', () => {
    const matic = cryptoassets['MATIC'];
    expect(getUNSKey(matic)).toBe('crypto.MATIC.version.MATIC.address');
  });
  it('returns ETH for unsupported EVM chain', () => {
    const eth = cryptoassets['ETH'];
    expect(getUNSKey(eth)).toBe('crypto.ETH.address');
  });
});

describe('uns resolver', () => {
  jest.setTimeout(90000);

  const unsResolver = new UNSResolver();
  it('should resolve polygon address', async () => {
    const matic = cryptoassets['MATIC'];
    const address = await unsResolver.lookupDomain('shaista.blockchain', matic);
    expect(address).toBe('0xada3bccf641da3b1b1553ed70e7f38c7ad1b3023');
  });
});
