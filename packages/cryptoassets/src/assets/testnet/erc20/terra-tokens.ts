import { ChainId } from '../../../types';
import { transformTokenMap } from '../../utils';

const TOKENS = {
  ANC: {
    name: 'ANC',
    code: 'ANC',
    decimals: 6,
    contractAddress: 'terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc',
    priceSource: {
      coinGeckoId: 'anchor-protocol',
    },
  },
};

export default transformTokenMap(TOKENS, ChainId.Terra);
