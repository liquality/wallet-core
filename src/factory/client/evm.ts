import { EIP1559FeeProvider, OptimismChainProvider, RpcFeeProvider } from '@chainify/evm';
import { asL2Provider } from '@eth-optimism/sdk';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { AccountType, Asset, Network } from '../../store/types';
import { ChainNetworks } from '../../utils/networks';
import { createEVMClient } from './clients';

export function createEthClient(
  asset: string,
  network: Network,
  mnemonic: string,
  accountType: AccountType,
  derivationPath: string
) {
  const ethNetwork = ChainNetworks.ethereum[network];
  const feeProvider = new EIP1559FeeProvider(ethNetwork.rpcUrl as string);
  return createEVMClient(asset, network, ethNetwork, mnemonic, accountType, derivationPath, feeProvider);
}

export function createRskClient(
  asset: Asset,
  network: Network,
  mnemonic: string,
  accountType: AccountType,
  derivationPath: string
) {
  const rskNetwork = ChainNetworks.rsk[network];
  const feeProvider = new RpcFeeProvider(rskNetwork.rpcUrl, {
    slowMultiplier: 1,
    averageMultiplier: 1,
    fastMultiplier: 1.25,
  });

  return createEVMClient(asset, network, rskNetwork, mnemonic, accountType, derivationPath, feeProvider);
}

export function createBSCClient(asset: Asset, network: Network, mnemonic: string, derivationPath: string) {
  const bscNetwork = ChainNetworks.bsc[network];

  const feeProvider = new RpcFeeProvider(bscNetwork.rpcUrl as string, {
    slowMultiplier: 1,
    averageMultiplier: 2,
    fastMultiplier: 2.2,
  });

  return createEVMClient(asset, network, bscNetwork, mnemonic, AccountType.Default, derivationPath, feeProvider);
}

export function createPolygonClient(asset: Asset, network: Network, mnemonic: string, derivationPath: string) {
  const polygonNetwork = ChainNetworks.polygon[network];

  const feeProvider =
    network === Network.Testnet
      ? new EIP1559FeeProvider(polygonNetwork.rpcUrl as string)
      : new RpcFeeProvider(polygonNetwork.rpcUrl as string, {
          slowMultiplier: 1,
          averageMultiplier: 2,
          fastMultiplier: 2.2,
        });

  return createEVMClient(asset, network, polygonNetwork, mnemonic, AccountType.Default, derivationPath, feeProvider);
}

export function createArbitrumClient(asset: Asset, network: Network, mnemonic: string, derivationPath: string) {
  const arbitrumNetwork = ChainNetworks.arbitrum[network];

  const feeProvider = new RpcFeeProvider(arbitrumNetwork.rpcUrl as string, {
    slowMultiplier: 1,
    averageMultiplier: 1,
    fastMultiplier: 1.25,
  });

  return createEVMClient(asset, network, arbitrumNetwork, mnemonic, AccountType.Default, derivationPath, feeProvider);
}

export function createAvalancheClient(asset: Asset, network: Network, mnemonic: string, derivationPath: string) {
  const avalancheNetwork = ChainNetworks.avalanche[network];

  const feeProvider = new RpcFeeProvider(avalancheNetwork.rpcUrl as string, {
    slowMultiplier: 1,
    averageMultiplier: 2,
    fastMultiplier: 2.2,
  });

  return createEVMClient(asset, network, avalancheNetwork, mnemonic, AccountType.Default, derivationPath, feeProvider);
}

export function createFuseClient(asset: Asset, network: Network, mnemonic: string, derivationPath: string) {
  const fuseNetwork = ChainNetworks.fuse[network];

  const feeProvider = new RpcFeeProvider(fuseNetwork.rpcUrl as string, {
    slowMultiplier: 1,
    averageMultiplier: 1,
    fastMultiplier: 1.25,
  });

  return createEVMClient(asset, network, fuseNetwork, mnemonic, AccountType.Default, derivationPath, feeProvider);
}

export function createOptimismClient(asset: Asset, network: Network, mnemonic: string, derivationPath: string) {
  const optimismNetwork = ChainNetworks.optimism[network];
  const jsonRpcProvider = asL2Provider(new StaticJsonRpcProvider(optimismNetwork.rpcUrl));
  const chainProvider = new OptimismChainProvider(optimismNetwork, jsonRpcProvider, {
    slowMultiplier: 1,
    averageMultiplier: 1,
    fastMultiplier: 1,
  });

  return createEVMClient(
    asset,
    network,
    optimismNetwork,
    mnemonic,
    AccountType.Default,
    derivationPath,
    undefined,
    undefined,
    chainProvider
  );
}
