import { CovalentNftProvider, EvmBaseWalletProvider, InfuraNftProvider, OpenSeaNftProvider } from '@chainify/evm';
import { BaseProvider } from '@ethersproject/providers';
import { NftProviderType } from '../../store/types';

export function getNftProvider(
  providerType: NftProviderType,
  walletProvider: EvmBaseWalletProvider<BaseProvider>,
  _testnet: boolean = false
) {
  switch (providerType) {
    case NftProviderType.OpenSea:
      return new OpenSeaNftProvider(walletProvider, {
        url: 'https://api.opensea.io/api/v1/',
        apiKey: '963da5bcea554a92b078fe1f48a2300e',
      });
    case NftProviderType.Infura:
      return new InfuraNftProvider(walletProvider, {
        url: 'https://nft.api.infura.io',

        apiKey: Buffer.from('37efa691ffec4c41a60aa4a69865d8f6:2123b0717d6a44738bbdbd28e8ce13cc').toString('base64'),
      });
    case NftProviderType.Covalent:
      return new CovalentNftProvider(walletProvider, {
        url: 'https://api.covalenthq.com/v1',
        apiKey: 'ckey_d87425e55bac4d78aa8ac902a34',
      });
  }
}
