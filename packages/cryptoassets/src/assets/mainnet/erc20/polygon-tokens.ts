import { ChainId } from '../../../types';
import { transformTokenMap } from '../../utils';

const TOKENS = {
  PWETH: {
    name: 'Polygon Wrapped Ether',
    code: 'PWETH',
    decimals: 18,
    contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    color: '#5b3159',
    matchingAsset: 'WETH',
  },
  PUSDC: {
    name: 'Polygon USD Coin',
    code: 'PUSDC',
    decimals: 6,
    contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    color: '#5b31b9',
    matchingAsset: 'USDC',
  },
  PUSDT: {
    name: 'Polygon Tether USD',
    code: 'PUSDT',
    decimals: 6,
    contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    color: '#5b31f9',
    matchingAsset: 'USDT',
  },
  PBUSD: {
    name: 'Polygon BUSD',
    code: 'PBUSD',
    decimals: 18,
    contractAddress: '0xdab529f40e671a1d4bf91361c21bf9f0c9712ab7',
    color: '#5b31a9',
    matchingAsset: 'BUSD',
  },
  PBNB: {
    name: 'Polygon BNB',
    code: 'PBNB',
    decimals: 18,
    contractAddress: '0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3',
    color: '#1b31a9',
    priceSource: {
      coinGeckoId: 'wbnb',
    },
  },
  PLINK: {
    name: 'Polygon LINK',
    code: 'PLINK',
    decimals: 18,
    contractAddress: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
    color: '#2b31a9',
    matchingAsset: 'LINK',
  },
  PDAI: {
    name: 'Polygon DAI',
    code: 'PDAI',
    decimals: 18,
    contractAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    color: '#3b31a9',
    matchingAsset: 'DAI',
  },
  POMG: {
    name: 'Polygon OMG',
    code: 'POMG',
    decimals: 18,
    contractAddress: '0x62414d03084eeb269e18c970a21f45d2967f0170',
    color: '#4b31a9',
    matchingAsset: 'OMG',
  },
  PWBTC: {
    name: 'Polygon WBTC',
    code: 'PWBTC',
    decimals: 8,
    contractAddress: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    color: '#4b31a9',
    matchingAsset: 'WBTC',
  },
  PFTM: {
    name: 'Polygon Fantom',
    code: 'PFTM',
    decimals: 18,
    contractAddress: '0xc9c1c1c20b3658f8787cc2fd702267791f224ce1',
    color: '#6b31a9',
    matchingAsset: 'FTM',
  },
  PENJ: {
    name: 'Polygon Enjin Coin',
    code: 'PENJ',
    decimals: 18,
    contractAddress: '0x7ec26842f195c852fa843bb9f6d8b583a274a157',
    color: '#6b31a9',
    matchingAsset: 'ENJ',
  },
  PUNI: {
    name: 'Polygon Uniswap',
    code: 'PUNI',
    decimals: 18,
    contractAddress: '0xb33eaad8d922b1083446dc23f610c2567fb5180f',
    color: '#6ba1a9',
    matchingAsset: 'UNI',
  },
  PGRT: {
    name: 'Polygon The Graph',
    code: 'PGRT',
    decimals: 18,
    contractAddress: '0x5fe2b58c013d7601147dcdd68c143a77499f5531',
    color: '#6b31c9',
    matchingAsset: 'GRT',
  },
  PHUSD: {
    name: 'Polygon HUSD',
    code: 'PHUSD',
    decimals: 8,
    contractAddress: '0x2088c47fc0c78356c622f79dba4cbe1ccfa84a91',
    color: '#6b3ea9',
    matchingAsset: 'HUSD',
  },
  PAAVE: {
    name: 'Polygon Aave',
    code: 'PAAVE',
    decimals: 18,
    contractAddress: '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
    color: '#6b38a9',
    matchingAsset: 'AAVE',
  },
  PSUSHI: {
    name: 'Polygon Sushi',
    code: 'PSUSHI',
    decimals: 18,
    contractAddress: '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a',
    color: '#6b37a9',
    matchingAsset: 'SUSHI',
  },
  P1INCH: {
    name: 'Polygon 1INCH',
    code: 'P1INCH',
    decimals: 18,
    contractAddress: '0x9c2c5fd7b07e95ee044ddeba0e97a665f142394f',
    color: '#6b23a9',
    matchingAsset: '1INCH',
  },
  PUSDK: {
    name: 'Polygon USDK',
    code: 'PUSDK',
    decimals: 18,
    contractAddress: '0xd07a7fac2857901e4bec0d89bbdae764723aab86',
    color: '#6cd1a9',
    matchingAsset: 'USDK',
  },
  PHOT: {
    name: 'Polygon HoloToken',
    code: 'PHOT',
    decimals: 18,
    contractAddress: '0x0c51f415cf478f8d08c246a6c6ee180c5dc3a012',
    color: '#8834ff',
    matchingAsset: 'HOT',
  },
  YFI: {
    name: 'Polygon yearn.finance',
    code: 'YFI',
    decimals: 18,
    contractAddress: '0xda537104d6a5edd53c6fbba9a898708e465260b6',
    color: '#007ae3',
    matchingAsset: 'YFI',
  },
  PCRV: {
    name: 'Polygon CRV',
    code: 'PCRV',
    decimals: 18,
    contractAddress: '0x172370d5cd63279efa6d502dab29171933a610af',
    color: '#1a41e9',
    matchingAsset: 'CRV',
  },
  PCOMP: {
    name: 'Polygon Compound',
    code: 'PCOMP',
    decimals: 18,
    contractAddress: '0x8505b9d2254a7ae468c0e9dd10ccea3a837aef5c',
    color: '#1a41f9',
    matchingAsset: 'COMP',
  },
  PZRX: {
    name: 'Polygon 0x',
    code: 'PZRX',
    decimals: 18,
    contractAddress: '0x5559edb74751a0ede9dea4dc23aee72cca6be3d5',
    color: '#302c3c',
    matchingAsset: 'ZRX',
  },
  PTUSD: {
    name: 'Polygon TrueUSD',
    code: 'PTUSD',
    decimals: 18,
    contractAddress: '0x2e1ad108ff1d8c782fcbbb89aad783ac49586756',
    color: '#2b2e8f',
    matchingAsset: 'TUSD',
  },
  PUST: {
    name: 'Polygon UST',
    code: 'PUST',
    decimals: 18,
    contractAddress: '0x692597b009d13c4049a947cab2239b7d6517875f',
    color: '#2b2e9f',
    priceSource: { coinGeckoId: 'terra-usd' },
  },
  PPOLY: {
    name: 'Polygon Polymath',
    code: 'PPOLY',
    decimals: 18,
    contractAddress: '0xcb059c5573646047d6d88dddb87b745c18161d3b',
    color: '#4c5ae5',
    matchingAsset: 'POLY',
  },
  PMKR: {
    name: 'Polygon Maker',
    code: 'PMKR',
    decimals: 18,
    contractAddress: '0x6f7C932e7684666C9fd1d44527765433e01fF61d',
    color: '#1abcec',
    matchingAsset: 'MKR',
  },
  PMANA: {
    name: 'Polygon Decentraland',
    code: 'PMANA',
    decimals: 18,
    contractAddress: '0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4',
    color: '#bfb5ef',
    matchingAsset: 'MANA',
  },
  PBAT: {
    name: 'Polygon Basic Attention Token',
    code: 'PBAT',
    decimals: 18,
    contractAddress: '0x3cef98bb43d732e2f285ee605a8158cde967d219',
    color: '#ff5200',
    matchingAsset: 'BAT',
  },
  PELON: {
    name: 'Polygon Dogelon MARS',
    code: 'PELON',
    decimals: 18,
    contractAddress: '0xe0339c80ffde91f3e20494df88d4206d86024cdf',
    color: '#1a41fe',
    matchingAsset: 'ELON',
  },
  PSNX: {
    name: 'Polygon Synthetix Network Token',
    code: 'PSNX',
    decimals: 18,
    contractAddress: '0x50b728d8d964fd00c2d0aad81718b71311fef68a',
    matchingAsset: 'SNX',
  },
  PBNT: {
    name: 'Polygon Bancor Network Token',
    code: 'PBNT',
    decimals: 18,
    contractAddress: '0xc26d47d5c33ac71ac5cf9f776d63ba292a4f7842',
    color: '#000d2b',
    matchingAsset: 'BNT',
  },
  POCEAN: {
    name: 'Polygon OCEAN Protocol',
    code: 'POCEAN',
    decimals: 18,
    contractAddress: '0x282d8efce846a88b159800bd4130ad77443fa1a1',
    color: '#1a413e',
    matchingAsset: 'OCEAN',
  },
  PWOO: {
    name: 'Polygon Wootrade Network',
    code: 'PWOO',
    decimals: 18,
    contractAddress: '0x1b815d120b3ef02039ee11dc2d33de7aa4a8c603',
    color: '#1ba13e',
    matchingAsset: 'WOO',
  },
  PFET: {
    name: 'Polygon Fetch',
    code: 'PFET',
    decimals: 18,
    contractAddress: '0x7583feddbcefa813dc18259940f76a02710a8905',
    color: '#1bac3e',
    matchingAsset: 'FET',
  },
  PWMATIC: {
    name: 'Wrapped Matic Token',
    code: 'PWMATIC',
    decimals: 18,
    contractAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    color: '#2b6cef',
    matchingAsset: 'WMATIC',
  },
  PCRO: {
    name: 'Polygon Crypto.com Chain',
    code: 'PCRO',
    decimals: 8,
    contractAddress: '0xada58df0f643d959c2a47c9d4d4c1a4defe3f11c',
    color: '#1b6cef',
    matchingAsset: 'CRO',
  },
  PUMA: {
    name: 'Polygon UMA',
    code: 'PUMA',
    decimals: 18,
    contractAddress: '0x3066818837c5e6ed6601bd5a91b0762877a6b731',
    color: '#ab6cef',
    matchingAsset: 'UMA',
  },
  PHEX: {
    name: 'Polygon HEX',
    code: 'PHEX',
    decimals: 8,
    contractAddress: '0x23d29d30e35c5e8d321e1dc9a8a61bfd846d4c5c',
    color: '#ee6cef',
    matchingAsset: 'HEX',
  },
  PIOTX: {
    name: 'Polygon IoTeX',
    code: 'PIOTX',
    decimals: 18,
    contractAddress: '0xf6372cdb9c1d3674e83842e3800f2a62ac9f3c66',
    color: '#00d4d8',
    matchingAsset: 'IOTX',
  },
};

export default transformTokenMap(TOKENS, ChainId.Polygon);
