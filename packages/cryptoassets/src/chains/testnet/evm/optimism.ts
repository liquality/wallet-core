import optimism from '../../../chains/mainnet/evm/optimism';
import { transformMainnetToTestnetChain } from '../../../chains/utils';

const optimismTestnet = transformMainnetToTestnetChain(
  optimism,
  {
    name: 'optimism_testnet',
    coinType: '60',
    networkId: 420,
    chainId: 420,
    isTestnet: true,
    rpcUrls: ['https://optimism-goerli.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f'],
  },
  [
    {
      tx: 'https://goerli-optimism.etherscan.io/tx/{hash}',
      address: 'https://goerli-optimism.etherscan.io/address/{address}',
      token: 'https://goerli-optimism.etherscan.io/token/{token}',
    },
  ],
  'https://optimismfaucet.xyz/'
);

export default {
  ...optimismTestnet,
  gasLimit: {
    // OP gas limits
    send: {
      native: 21_000,
      nonNative: 100_000,
    },
    // ETH gas limits
    // multiply the gas limit by 1.5 which is the L1 scalar for testnet
    sendL1: {
      native: 7_500, // 5000 * 1.5
      nonNative: 8_250, // 5500 * 1.5
    },
  },
};
