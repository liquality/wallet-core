import { ChainId } from '../../../types';
import { transformTokenMap } from '../../utils';

const TOKENS = {
  sUSDT: {
    name: 'sUSDT',
    code: 'sUSDT',
    decimals: 6,
    contractAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    matchingAsset: 'USDT',
  },
  sUSDC: {
    name: 'sUSDC',
    code: 'sUSDC',
    decimals: 6,
    contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    matchingAsset: 'USDC',
  },
  RAY: {
    name: 'RAY',
    code: 'RAY',
    decimals: 6,
    contractAddress: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    priceSource: {
      coinGeckoId: 'raydium',
    },
  },
  SRM: {
    name: 'SERUM',
    code: 'SRM',
    decimals: 6,
    contractAddress: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    priceSource: {
      coinGeckoId: 'serum',
    },
  },
  LINK: {
    name: 'soLINK',
    code: 'LINK',
    decimals: 6,
    contractAddress: 'CWE8jPTUYhdCTZYWPTe1o5DFqfdjzWKc9WKz6rSjQUdG',
    matchingAsset: 'LINK',
  },
};

export default transformTokenMap(TOKENS, ChainId.Solana);
