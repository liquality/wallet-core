import { IAsset } from '../interfaces/IAsset';
import { AssetTypes, ChainId, MakeOptional } from '../types';
import { AssetMap } from './mainnet/native';

/**
 * Adds the common properties for each token map - type and chain
 * @param tokens
 * @param chain
 * @returns
 */
export const transformTokenMap = (
  tokens: Record<string, MakeOptional<IAsset, 'type' | 'chain'>>,
  chain: ChainId
): AssetMap => {
  return Object.values(tokens).reduce((result: AssetMap, token) => {
    result[token.code] = { ...token, type: AssetTypes.erc20, chain };
    return result;
  }, {});
};

/**
 * {
 *    [chainId_1]: {
 *        [token_1_address]: {...},
 *        [token_2_address]: {...}
 *    },
 *    [chainId_2]: {
 *        [token_1_address]: {...},
 *        [token_2_address]: {...}
 *    }
 * }
 * @param tokens
 * @returns
 */
export const transformChainToTokenAddress = (tokens: AssetMap) => {
  return Object.values(tokens).reduce((result: Record<string, AssetMap>, token: IAsset) => {
    result[token.chain] = { ...result[token.chain], [String(token.contractAddress)]: { ...token } };
    return result;
  }, {});
};
