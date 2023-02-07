import { ChainId } from '../types';
interface OriginChains {
    [index: string]: ChainId[];
}
declare const dappChains: OriginChains;
export { dappChains };
