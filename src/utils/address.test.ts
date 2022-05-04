import { shortenAddress } from './address';

test('should be able to validate short address', async () => {
  expect(shortenAddress('0x0d1f4b24cc8e8e9c0a8b0e8d8c8d8e8e8e8e8e8e8e')).toContain('...');
});

test('should be able to validate terra short address', async () => {
  expect(shortenAddress('0xterra1u4sntjr03074wdxtqvsamltzd2ynrsfra3502u')).toContain('...');
  expect(shortenAddress('0xterra1u4sntjr03074wdxtqvsamltzd2ynrsfra3502u')).toContain('terr');
});
