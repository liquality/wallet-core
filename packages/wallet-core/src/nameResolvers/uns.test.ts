import { ChainId } from '@liquality/cryptoassets';
import { chainToUNSKey, UNSResolver } from './uns';

describe('chainToUNSKey', () => {
  it('returns correct key for bitcoin', () => {
    expect(chainToUNSKey(ChainId.Bitcoin)).toBe('BTC');
  });
  it('returns correct key for polygon', () => {
    expect(chainToUNSKey(ChainId.Polygon)).toBe('MATIC.version.MATIC');
  });
  it('returns ETH for unsupported EVM chain', () => {
    expect(chainToUNSKey(ChainId.Arbitrum)).toBe('ETH');
  });
});

describe('uns resolver', () => {
  const unsResolver = new UNSResolver();
  it('should resolve polygon address', async () => {
    const address = await unsResolver.lookupDomain('shaista.blockchain', ChainId.Polygon);
    expect(address).toBe('0xada3bccf641da3b1b1553ed70e7f38c7ad1b3023');
  });
});
