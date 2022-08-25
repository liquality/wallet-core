import { IChain } from '../../interfaces/IChain';
import { ChainId } from '../../types';

import ArbitrumChain from './evm/arbitrum';
import AvalancheChain from './evm/avalanche';
import BscChain from './evm/bsc';
import EthereumChain from './evm/ethereum';
import FuseChain from './evm/fuse';
import OptimismChain from './evm/optimism';
import PolygonChain from './evm/polygon';
import RskChain from './evm/rsk';

export const TESTNET_EVM_CHAINS: { [key in ChainId]?: IChain } = {
  [ChainId.Ethereum]: EthereumChain,
  [ChainId.BinanceSmartChain]: BscChain,
  [ChainId.Polygon]: PolygonChain,
  [ChainId.Arbitrum]: ArbitrumChain,
  [ChainId.Fuse]: FuseChain,
  [ChainId.Avalanche]: AvalancheChain,
  [ChainId.Rootstock]: RskChain,
  [ChainId.Optimism]: OptimismChain,
};
