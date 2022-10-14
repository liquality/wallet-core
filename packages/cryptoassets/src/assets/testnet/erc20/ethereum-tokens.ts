import { ChainId } from '../../../types';
import { transformTokenMap } from '../../utils';

const TOKENS = {
  DAI: {
    name: 'Dai Stablecoin',
    code: 'DAI',
    decimals: 18,
    contractAddress: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
    color: '#AB7E21',
    priceSource: {
      coinGeckoId: 'dai',
    },
  },
  WBTC: {
    name: 'Wrapped BTC',
    code: 'WBTC',
    decimals: 8,
    contractAddress: '0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05',
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
