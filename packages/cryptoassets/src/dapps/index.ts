import { ChainId } from '../types';
import dapps from './dapps.json';

interface OriginChains {
  [index: string]: ChainId[];
}

const dappChains = dapps as OriginChains;

export { dappChains };
