import { IChain } from '../interfaces/IChain';
import { INetwork, IUtxoNetwork } from '../interfaces/INetwork';
import { ExplorerView } from '../types';

export const transformMainnetToTestnetChain = (
  chain: IChain,
  network: INetwork,
  explorerViews: ExplorerView[],
  faucetUrl: string
): IChain => {
  const testnetChain = { ...chain, network, explorerViews, faucetUrl };

  if (!testnetChain.network.isTestnet) {
    throw new Error(`isTestnet should be set to true`);
  }

  if (testnetChain.network.chainId && chain.network.chainId && testnetChain.network.chainId == chain.network.chainId) {
    throw new Error(`Testnet cannot have the same chainId as the mainnet`);
  }

  if (
    testnetChain.network.networkId &&
    chain.network.networkId &&
    testnetChain.network.networkId == chain.network.networkId
  ) {
    throw new Error(`Testnet cannot have the same networkId as the mainnet`);
  }

  testnetChain.explorerViews.forEach((testnetExplorerViews) => {
    chain.explorerViews.forEach((mainnetExplorerViews) => {
      if (testnetExplorerViews.address && testnetExplorerViews.address === mainnetExplorerViews.address) {
        throw new Error(`Testnet cannot have the same explorer view as the mainnet`);
      }

      if (testnetExplorerViews.token && testnetExplorerViews.token === mainnetExplorerViews.token) {
        throw new Error(`Testnet cannot have the same explorer view as the mainnet`);
      }

      if (testnetExplorerViews.tx && testnetExplorerViews.tx === mainnetExplorerViews.tx) {
        throw new Error(`Testnet cannot have the same explorer view as the mainnet`);
      }
    });
  });

  testnetChain.network.rpcUrls.forEach((rpcUrl) => {
    if (chain.network.rpcUrls.includes(rpcUrl)) {
      throw new Error(`Testnet cannot have matching rpc urls with mainnet`);
    }
  });

  testnetChain.network.scraperUrls?.forEach((scraperUrl) => {
    if (chain.network.scraperUrls?.includes(scraperUrl)) {
      throw new Error(`Testnet cannot have matching scraper urls with mainnet`);
    }
  });

  if (testnetChain.network.utxo && chain.network.utxo) {
    assertUtxoProps(testnetChain.network.utxo, chain.network.utxo);
  }

  return testnetChain;
};

const assertUtxoProps = (testnetUtxo: IUtxoNetwork, mainnetUtxo: IUtxoNetwork) => {
  if (
    testnetUtxo.bech32 == mainnetUtxo.bech32 ||
    testnetUtxo.bip32.private == mainnetUtxo.bip32.private ||
    testnetUtxo.bip32.public == mainnetUtxo.bip32.public ||
    testnetUtxo.pubKeyHash == mainnetUtxo.pubKeyHash ||
    testnetUtxo.scriptHash == mainnetUtxo.scriptHash ||
    testnetUtxo.wif == mainnetUtxo.wif
  ) {
    throw new Error('UTXO config between test and mainnet cannot match');
  }
};
