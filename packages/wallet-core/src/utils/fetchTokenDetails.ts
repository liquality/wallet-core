import { ChainId, getChain } from '@liquality/cryptoassets';
import { Network } from '../store/types';

export const CHAINS_WITH_FETCH_TOKEN_DETAILS = Object.values(ChainId).reduce((result: Array<any>, chainId: ChainId) => {
  const chain = getChain(Network.Mainnet, chainId);

  if (chain.hasTokens) {
    result.push({
      chainId,
      label: `${capitalizeFirstLetter(chain.name)} (${chain.nativeAsset[0].code.toUpperCase()})`,
    });
  }

  return result;
}, []);

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
