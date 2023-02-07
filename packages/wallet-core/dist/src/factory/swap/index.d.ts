import { Network, SwapProviderType } from '../../store/types';
import { SwapProvider } from '../../swaps/SwapProvider';
declare function getSwapProvider(network: Network, providerId: SwapProviderType): SwapProvider;
export { getSwapProvider };
