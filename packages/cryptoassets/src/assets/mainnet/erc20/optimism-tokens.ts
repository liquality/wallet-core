import { ChainId } from '../../../types';
import { transformTokenMap } from '../../utils';

const TOKENS = {
  OPSNX: {
    name: 'Optimism Synthetix',
    code: 'OPSNX',
    decimals: 18,
    contractAddress: '0x8700daec35af8ff88c16bdf0418774cb3d7599b4',
    matchingAsset: 'SNX',
    priceSource: {
      coinGeckoId: 'havven',
    },
  },
  OPDAI: {
    name: 'Optimism Dai stable coin',
    code: 'OPDAI',
    decimals: 18,
    contractAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    color: '#AB7E21',
    matchingAsset: 'DAI',
    priceSource: {
      coinGeckoId: 'dai',
    },
  },
  OPUSDT: {
    name: 'Optimism Tether USD',
    code: 'OPUSDT',
    decimals: 6,
    contractAddress: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    color: '#26a17b',
    matchingAsset: 'USDT',
    priceSource: {
      coinGeckoId: 'tether',
    },
  },
  OPWBTC: {
    name: 'Optimism Wrapped BTC',
    code: 'OPWBTC',
    decimals: 8,
    contractAddress: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
    matchingAsset: 'WBTC',
    priceSource: {
      coinGeckoId: 'wrapped-bitcoin',
    },
  },
  OP0xBTC: {
    name: 'Optimism 0xBitcoin Token',
    code: 'OP0xBTC',
    decimals: 8,
    contractAddress: '0xe0BB0D3DE8c10976511e5030cA403dBf4c25165B',
    matchingAsset: '0xBTC',
    priceSource: {
      coinGeckoId: 'oxbitcoin',
    },
  },
  OPLINK: {
    name: 'Optimism Chainlink Token',
    code: 'OPLINK',
    decimals: 18,
    contractAddress: '0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6',
    color: '#01a6fb',
    matchingAsset: 'LINK',
    priceSource: {
      coinGeckoId: 'chainlink',
    },
  },
  OPENS: {
    name: 'Optimism Ethereum Name Service',
    code: 'OPENS',
    decimals: 18,
    contractAddress: '0x65559aA14915a70190438eF90104769e5E890A00',
    matchingAsset: 'ENS',
    priceSource: {
      coinGeckoId: 'ethereum-name-service',
    },
  },
  OPsUSD: {
    name: 'Optimism Synthetix USD',
    code: 'OPsUSD',
    decimals: 18,
    contractAddress: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
    matchingAsset: 'sUSD',
    priceSource: {
      coinGeckoId: 'nusd',
    },
  },
  OPUSDC: {
    name: 'Optimism USD Coin',
    code: 'OPUSDC',
    decimals: 6,
    contractAddress: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    color: '#2775c9',
    matchingAsset: 'USDC',
    priceSource: {
      coinGeckoId: 'usd-coin',
    },
  },
  OPsETH: {
    name: 'Optimism Synthetic Ether',
    code: 'OPsETH',
    decimals: 18,
    contractAddress: '0xE405de8F52ba7559f9df3C368500B6E6ae6Cee49',
    matchingAsset: 'sETH',
    priceSource: {
      coinGeckoId: 'seth',
    },
  },
  OPsBTC: {
    name: 'Optimism Synthetic Bitcoin',
    code: 'OPsBTC',
    decimals: 18,
    contractAddress: '0x298B9B95708152ff6968aafd889c6586e9169f1D',
    matchingAsset: 'sBTC',
    priceSource: {
      coinGeckoId: 'sbtc',
    },
  },
  OPsLINK: {
    name: 'Optimism Synthetic Chainlink',
    code: 'OPsLINK',
    decimals: 18,
    contractAddress: '0xc5Db22719A06418028A40A9B5E9A7c02959D0d08',
    color: '#01a6fb',
    matchingAsset: 'sLINK',
    priceSource: {
      coinGeckoId: 'slink',
    },
  },
  OPUNI: {
    name: 'Optimism Uniswap',
    code: 'OPUNI',
    decimals: 18,
    contractAddress: '0x6fd9d7ad17242c41f7131d257212c54a0e816691',
    matchingAsset: 'UNI',
    priceSource: {
      coinGeckoId: 'uniswap',
    },
  },
  OPLUSD: {
    name: 'Optimism LUSD Stablecoin',
    code: 'OPLUSD',
    decimals: 18,
    contractAddress: '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819',
    matchingAsset: 'LUSD',
    priceSource: {
      coinGeckoId: 'lusd',
    },
  },
  OPRGT: {
    name: 'Optimism Rari Governance Token',
    code: 'OPRGT',
    decimals: 18,
    contractAddress: '0xb548f63d4405466b36c0c0ac3318a22fdcec711a',
    matchingAsset: 'RGT',
    priceSource: {
      coinGeckoId: 'rari-governance-token',
    },
  },
  OPRAI: {
    name: 'Optimism Rai Reflex Index ',
    code: 'OPRAI',
    decimals: 18,
    contractAddress: '0x7FB688CCf682d58f86D7e38e03f9D22e7705448B',
    matchingAsset: 'RAI',
    priceSource: {
      coinGeckoId: 'rai',
    },
  },
  OPrETH: {
    name: 'Optimism Rocket Pool ETH',
    code: 'OPrETH',
    decimals: 18,
    contractAddress: '0x9bcef72be871e61ed4fbbc7630889bee758eb81d',
    matchingAsset: 'rETH',
    priceSource: {
      coinGeckoId: 'rocket-pool-eth',
    },
  },
  OPPAPER: {
    name: 'Optimism Paper',
    code: 'OPPAPER',
    decimals: 18,
    contractAddress: '0x00F932F0FE257456b32dedA4758922E56A4F4b42',
    matchingAsset: 'PAPER',
    priceSource: {
      coinGeckoId: 'paper-fantom',
    },
  },
  OPSARCO: {
    name: 'Optimism Sarcophagus',
    code: 'OPSARCO',
    decimals: 18,
    contractAddress: '0x7c6b91d9be155a6db01f749217d76ff02a7227f2',
    matchingAsset: 'SARCO',
    priceSource: {
      coinGeckoId: 'sarcophagus',
    },
  },
  OPBitANT: {
    name: 'Optimism BitANT',
    code: 'OPBitANT',
    decimals: 18,
    contractAddress: '0x5029C236320b8f15eF0a657054B84d90bfBEDED3',
    matchingAsset: 'BitANT',
    priceSource: {
      coinGeckoId: 'bitant',
    },
  },
  OPBitBTC: {
    name: 'Optimism BitBTC',
    code: 'OPBitBTC',
    decimals: 18,
    contractAddress: '0xc98B98d17435AA00830c87eA02474C5007E1f272',
    matchingAsset: 'BitBTC',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  OPLYRA: {
    name: 'Optimism Lyra',
    code: 'OPLYRA',
    decimals: 18,
    contractAddress: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    matchingAsset: 'LYRA',
    priceSource: {
      coinGeckoId: 'lyra-finance',
    },
  },
  OPUMA: {
    name: 'Optimism UMA',
    code: 'OPUMA',
    decimals: 18,
    contractAddress: '0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea',
    matchingAsset: 'UMA',
    priceSource: {
      coinGeckoId: 'uma',
    },
  },
  OPPERP: {
    name: 'Optimism Perpetual',
    code: 'OPPERP',
    decimals: 18,
    contractAddress: '0x9e1028F5F1D5eDE59748FFceE5532509976840E0',
    matchingAsset: 'PERP',
    priceSource: {
      coinGeckoId: 'perpetual-protocol',
    },
  },
  OPDF: {
    name: 'Optimism dForce',
    code: 'OPDF',
    decimals: 18,
    contractAddress: '0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3',
    matchingAsset: 'DF',
    priceSource: {
      coinGeckoId: 'dforce-token',
    },
  },
  OPUSX: {
    name: 'Optimism dForce USD',
    code: 'OPUSX',
    decimals: 18,
    contractAddress: '0xbfD291DA8A403DAAF7e5E9DC1ec0aCEaCd4848B9',
    matchingAsset: 'USX',
    priceSource: {
      coinGeckoId: 'token-dforce-usd',
    },
  },
  OPBOND: {
    name: 'Optimism BarnBridge Governance Token',
    code: 'OPBOND',
    decimals: 18,
    contractAddress: '0x3e7eF8f50246f725885102E8238CBba33F276747',
    matchingAsset: 'BOND',
    priceSource: {
      coinGeckoId: 'barnbridge',
    },
  },
  OPWETH: {
    name: 'Optimism Wrapped Ether',
    code: 'OPWETH',
    decimals: 18,
    contractAddress: '0x4200000000000000000000000000000000000006',
    matchingAsset: 'WETH',
    priceSource: {
      coinGeckoId: 'weth',
    },
  },
  OPEST: {
    name: 'Optimism Erica Social Token',
    code: 'OPEST',
    decimals: 18,
    contractAddress: '0x7b0bcC23851bBF7601efC9E9FE532Bf5284F65d3',
    matchingAsset: 'EST',
    priceSource: {
      coinGeckoId: 'erica-social-token',
    },
  },
  OPDCN: {
    name: 'Optimism Dentacoin',
    code: 'OPDCN',
    decimals: 0,
    contractAddress: '0x1da650c3b2daa8aa9ff6f661d4156ce24d08a062',
    color: '#136485',
    matchingAsset: 'DCN',
    priceSource: {
      coinGeckoId: 'dentacoin',
    },
  },
  OPKROM: {
    name: 'Optimism Kromatika',
    code: 'OPKROM',
    decimals: 18,
    contractAddress: '0xf98dcd95217e15e05d8638da4c91125e59590b07',
    matchingAsset: 'KROM',
    priceSource: {
      coinGeckoId: 'kromatika',
    },
  },
  OPDHT: {
    name: 'Optimism dHEDGE DAO Token',
    code: 'OPDHT',
    decimals: 18,
    contractAddress: '0xAF9fE3B5cCDAe78188B1F8b9a49Da7ae9510F151',
    matchingAsset: 'DHT',
    priceSource: {
      coinGeckoId: 'dhedge-dao',
    },
  },
  OPMKR: {
    name: 'Optimism Maker',
    code: 'OPMKR',
    decimals: 18,
    contractAddress: '0xab7badef82e9fe11f6f33f87bc9bc2aa27f2fcb5',
    color: '#1abc9c',
    matchingAsset: 'MKR',
    priceSource: {
      coinGeckoId: 'maker',
    },
  },
  OPLIZ: {
    name: 'Optimism Theranos Coin',
    code: 'OPLIZ',
    decimals: 18,
    contractAddress: '0x3bB4445D30AC020a84c1b5A8A2C6248ebC9779D0',
    matchingAsset: 'LIZ',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  OPMASK: {
    name: 'Optimism Mask Network',
    code: 'OPMASK',
    decimals: 18,
    contractAddress: '0x3390108E913824B8eaD638444cc52B9aBdF63798',
    matchingAsset: 'MASK',
    priceSource: {
      coinGeckoId: 'mask-network',
    },
  },
  OPCRV: {
    name: 'Optimism Curve DAO Token',
    code: 'OPCRV',
    decimals: 18,
    contractAddress: '0x0994206dfe8de6ec6920ff4d779b0d950605fb53',
    color: '#1a41e9',
    matchingAsset: 'CRV',
    priceSource: {
      coinGeckoId: 'curve-dao-token',
    },
  },
  OPSPANK: {
    name: 'Optimism SPANK',
    code: 'OPSPANK',
    decimals: 18,
    contractAddress: '0xcfD1D50ce23C46D3Cf6407487B2F8934e96DC8f9',
    matchingAsset: 'SPANK',
    priceSource: {
      coinGeckoId: 'spankchain',
    },
  },
  OPLRC: {
    name: 'Optimism Loopring',
    code: 'OPLRC',
    decimals: 18,
    contractAddress: '0xFEaA9194F9F8c1B65429E31341a103071464907E',
    color: '#2ab6f6',
    matchingAsset: 'LRC',
    priceSource: {
      coinGeckoId: 'loopring',
    },
  },
  OPTHALES: {
    name: 'Optimism Thales',
    code: 'OPTHALES',
    decimals: 18,
    contractAddress: '0x217D47011b23BB961eB6D93cA9945B7501a5BB11',
    matchingAsset: 'THALES',
    priceSource: {
      coinGeckoId: 'thales',
    },
  },
  OPAAVE: {
    name: 'Optimism Aave',
    code: 'OPAAVE',
    decimals: 18,
    contractAddress: '0x76FB31fb4af56892A25e32cFC43De717950c9278',
    matchingAsset: 'AAVE',
    priceSource: {
      coinGeckoId: 'aave',
    },
  },
  OPEQZ: {
    name: 'Optimism Equalizer',
    code: 'OPEQZ',
    decimals: 18,
    contractAddress: '0x81ab7e0d570b01411fcc4afd3d50ec8c241cb74b',
    matchingAsset: 'EQZ',
    priceSource: {
      coinGeckoId: 'equalizer',
    },
  },
  OPGYSR: {
    name: 'Optimism Geyser',
    code: 'OPGYSR',
    decimals: 18,
    contractAddress: '0x117cFd9060525452db4A34d51c0b3b7599087f05',
    matchingAsset: 'GYSR',
    priceSource: {
      coinGeckoId: 'geyser',
    },
  },
  OPBAL: {
    name: 'Optimism Balancer (BAL)',
    code: 'OPBAL',
    decimals: 18,
    contractAddress: '0xFE8B128bA8C78aabC59d4c64cEE7fF28e9379921',
    matchingAsset: 'BAL',
    priceSource: {
      coinGeckoId: 'balancer',
    },
  },
};

export default transformTokenMap(TOKENS, ChainId.Optimism);
