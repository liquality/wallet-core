import { ActionContext, rootActionContext } from '..';
import { Asset, CurrenciesInfo } from '../types';
import { getCurrenciesInfo } from '../utils';

export const updateCurrenciesInfo = async (
  context: ActionContext,
  { assets }: { assets: Asset[] }
): Promise<CurrenciesInfo> => {
  const { commit } = rootActionContext(context);

  const currenciesInfo = await getCurrenciesInfo(assets);

  commit.UPDATE_CURRENCIES_INFO({ currenciesInfo });

  return currenciesInfo;
};
