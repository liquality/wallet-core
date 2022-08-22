import { ChainId } from '@liquality/cryptoassets';
import { Chain as SymbiosisChain, ChainId as SymbiosisChainId, getChainById, Token } from 'symbiosis-js-sdk';
import { Asset, Network } from '../../store/types';
import { isERC20, isEthereumNativeAsset } from '../../utils/asset';
import cryptoassets from '../../utils/cryptoassets';

export const ADDRESS_ZERO = '0x1111111111111111111111111111111111111111';

export const DEFAULT_DEADLINE = Math.floor(Date.now() / 1000) * 20 * 60;

export const DEFAULT_SLIPPAGE = 300;

export const LIQUALITY_CLIENT_ID = 'liquality';

export const FEE_UNITS = {
  ETH: 200000,
  BNB: 200000,
  MATIC: 200000,
  AVAX: 200000,
  ERC20: 300000,
};

export const APPROVE_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

function getSymbiosisChain(network: Network, chainName: ChainId): SymbiosisChain | undefined {
  const isMainnet = network === Network.Mainnet;
  const chains: { [key: string]: SymbiosisChainId } = {
    [ChainId.Ethereum]: isMainnet ? SymbiosisChainId.ETH_MAINNET : SymbiosisChainId.ETH_RINKEBY,
    [ChainId.Avalanche]: isMainnet ? SymbiosisChainId.AVAX_MAINNET : SymbiosisChainId.AVAX_TESTNET,
    [ChainId.BinanceSmartChain]: isMainnet ? SymbiosisChainId.BSC_MAINNET : SymbiosisChainId.BSC_TESTNET,
    [ChainId.Polygon]: isMainnet ? SymbiosisChainId.MATIC_MAINNET : SymbiosisChainId.MATIC_MUMBAI,
  };

  const chainId = chains[chainName];
  if (!chainId) {
    return;
  }

  return getChainById(chainId);
}

export function getSymbiosisToken(network: Network, asset: Asset): Token | null {
  const cryptoAsset = cryptoassets[asset];
  const chain = getSymbiosisChain(network, cryptoAsset.chain);

  if (!chain) {
    return null;
  }

  let address;
  let isNative;
  if (isEthereumNativeAsset(asset)) {
    address = '';
    isNative = true;
  } else if (cryptoAsset.contractAddress && isERC20(asset)) {
    address = cryptoAsset.contractAddress;
  } else {
    return null;
  }

  return new Token({
    address,
    chainId: chain.id,
    decimals: cryptoAsset.decimals,
    isNative,
    symbol: asset,
  });
}
