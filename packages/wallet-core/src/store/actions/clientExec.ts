import { Address } from '@chainify/types';
import { ActionContext, rootActionContext } from '..';
import { AccountId, Asset, Network, WalletId } from '../types';

export const clientExec = async (
  context: ActionContext,
  {
    network,
    walletId,
    asset,
    method,
    args,
    returnType,
    accountId,
  }: {
    network: Network;
    walletId: WalletId;
    asset: Asset;
    method: string;
    args: string[];
    returnType: string;
    accountId: AccountId;
  }
): Promise<any> => {
  const { getters } = rootActionContext(context);
  const client = getters.client({ network, walletId, asset, accountId });

  const [namespace, fnName] = method.split('.');

  let result = await (client as any)[namespace][fnName](...args);

  if (returnType) {
    switch (returnType) {
      case 'Address':
        result = result.address;
        break;

      case 'Addresses':
        result = result.map((item: Address) => item.address);
        break;

      case 'BigNumber':
        result = result.toString();

        break;
    }
  }

  return result;
};
