import { ChainId } from '../../../types';
import { transformTokenMap } from '../../utils';

const TOKENS = {
  DAI: {
    name: 'Dai Stablecoin',
    code: 'DAI',
    decimals: 18,
    contractAddress: '0xad6d458402f60fd3bd25163575031acdce07538d',
    color: '#AB7E21',
    priceSource: {
      coinGeckoId: 'dai',
    },
  },
  WBTC: {
    name: 'Wrapped BTC',
    code: 'WBTC',
    decimals: 8,
    contractAddress: '0x1371597fc11aedbd2446f5390fa1dbf22491752a',
    priceSource: {
      coinGeckoId: 'wrapped-bitcoin',
    },
  },
  SUSHI: {
    name: 'Sushi',
    code: 'SUSHI',
    decimals: 18,
    contractAddress: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
    color: '#1a41b9',
    priceSource: {
      coinGeckoId: 'sushi',
    },
  },
};

export default transformTokenMap(TOKENS, ChainId.Ethereum);
