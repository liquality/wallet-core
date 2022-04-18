import { ActionContext, rootActionContext } from '..';
import { Asset } from '../types';
import { getPrices } from '../utils';

export const updateFiatRates = async (context: ActionContext, { assets }: { assets: Asset[] }) => {
  const { commit } = rootActionContext(context);
  const fiatRates = await getPrices(assets, 'usd');

  commit.UPDATE_FIAT_RATES({ fiatRates });

  return fiatRates;
};
