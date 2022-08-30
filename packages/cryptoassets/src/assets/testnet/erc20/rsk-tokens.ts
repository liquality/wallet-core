import { ChainId } from '../../../types';
import { transformTokenMap } from '../../utils';

const TOKENS = {
  SOV: {
    name: 'Sovryn',
    code: 'SOV',
    decimals: 18,
    contractAddress: '0x6a9A07972D07E58f0daF5122D11e069288A375fB',
    color: '#000000',
    priceSource: {
      coinGeckoId: 'sovryn',
    },
  },
};

export default transformTokenMap(TOKENS, ChainId.Rootstock);
