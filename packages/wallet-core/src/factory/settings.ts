import { Network as ChainifyNetwork } from '@chainify/types';
import { ChainId, getChain } from '@liquality/cryptoassets';
import { ChainNetworks } from '../utils/networks';
import buildConfig from '../build.config';
import { Network } from '../store/types';

export const defaultChainSettings: Record<Network, Record<ChainId, ChainifyNetwork>> = buildConfig.networks.reduce((prev, curr) => {
    const chains =  buildConfig.chains.map( (chainId) => {
        const chain = getChain(curr, chainId);
        const { network } = chain;
        const { name, coinType, isTestnet, rpcUrls} = network;
        const chainNetwork = ChainNetworks[chainId] ? ChainNetworks[chainId][curr] : {} || {};
        const chainifyNetwork = {
            name,
            coinType,
            isTestnet,
            chainId,
            rpcUrl: rpcUrls && rpcUrls.length > 0 ? rpcUrls[0] : undefined,
            ...chainNetwork,
            custom: false
        };

        if (chainId === ChainId.Bitcoin) {
            return {
                ...chainifyNetwork,
                esploraApi: buildConfig.exploraApis[curr],
                batchEsploraApi: buildConfig.batchEsploraApis[curr],
                feeProvider: 'https://liquality.io/swap/mempool/v1/fees/recommended'
            } as ChainifyNetwork
        }

        return chainifyNetwork;
    });
    return {
        ...prev,
        [curr]: chains
    };

}, {} as Record<Network, Record<ChainId, ChainifyNetwork>>)