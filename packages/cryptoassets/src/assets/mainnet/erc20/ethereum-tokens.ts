import { ChainId } from '../../../types';
import { transformTokenMap } from '../../utils';

const TOKENS = {
  ZAP: {
    name: 'ZAP TOKEN',
    code: 'ZAP',
    decimals: 18,
    contractAddress: '0x6781a0F84c7E9e846DCb84A9a5bd49333067b104',
    priceSource: {
      coinGeckoId: 'zap',
    },
  },
  SKL: {
    name: 'SKALE',
    code: 'SKL',
    decimals: 18,
    contractAddress: '0x00c83aeCC790e8a4453e5dD3B0B4b3680501a7A7',
    priceSource: {
      coinGeckoId: 'skale',
    },
  },
  USDN: {
    name: 'Neutrino USD',
    code: 'USDN',
    decimals: 18,
    contractAddress: '0x674C6Ad92Fd080e4004b2312b45f796a192D27a0',
    priceSource: {
      coinGeckoId: 'neutrino',
    },
  },
  FRM: {
    name: 'Ferrum Network Token',
    code: 'FRM',
    decimals: 6,
    contractAddress: '0xE5CAeF4Af8780E59Df925470b050Fb23C43CA68C',
    priceSource: {
      coinGeckoId: 'ferrum-network',
    },
  },
  IDRT: {
    name: 'Rupiah Token',
    code: 'IDRT',
    decimals: 2,
    contractAddress: '0x998FFE1E43fAcffb941dc337dD0468d52bA5b48A',
    priceSource: {
      coinGeckoId: 'rupiah-token',
    },
  },
  FTM: {
    name: 'Fantom',
    code: 'FTM',
    decimals: 18,
    contractAddress: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
    priceSource: {
      coinGeckoId: 'fantom',
    },
  },
  REVV: {
    name: 'REVV',
    code: 'REVV',
    decimals: 18,
    contractAddress: '0x557B933a7C2c45672B610F8954A3deB39a51A8Ca',
    priceSource: {
      coinGeckoId: 'revv',
    },
  },
  aAAVE: {
    name: 'Aave AAVE',
    code: 'aAAVE',
    decimals: 18,
    contractAddress: '0xFFC97d72E13E01096502Cb8Eb52dEe56f74DAD7B',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aBAT: {
    name: 'Aave BAT',
    code: 'aBAT',
    decimals: 18,
    contractAddress: '0x05Ec93c0365baAeAbF7AefFb0972ea7ECdD39CF1',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aBUSD: {
    name: 'Aave BUSD',
    code: 'aBUSD',
    decimals: 18,
    contractAddress: '0xA361718326c15715591c299427c62086F69923D9',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aDAI: {
    name: 'Aave DAI',
    code: 'aDAI',
    decimals: 18,
    contractAddress: '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aENJ: {
    name: 'Aave ENJ',
    code: 'aENJ',
    decimals: 18,
    contractAddress: '0xaC6Df26a590F08dcC95D5a4705ae8abbc88509Ef',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aKNC: {
    name: 'Aave KNC',
    code: 'aKNC',
    decimals: 18,
    contractAddress: '0x39C6b3e42d6A679d7D776778Fe880BC9487C2EDA',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aLINK: {
    name: 'Aave LINK',
    code: 'aLINK',
    decimals: 18,
    contractAddress: '0xa06bC25B5805d5F8d82847D191Cb4Af5A3e873E0',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aMANA: {
    name: 'Aave MANA',
    code: 'aMANA',
    decimals: 18,
    contractAddress: '0xa685a61171bb30d4072B338c80Cb7b2c865c873E',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aMKR: {
    name: 'Aave MKR',
    code: 'aMKR',
    decimals: 18,
    contractAddress: '0xc713e5E149D5D0715DcD1c156a020976e7E56B88',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aREN: {
    name: 'Aave REN',
    code: 'aREN',
    decimals: 18,
    contractAddress: '0xCC12AbE4ff81c9378D670De1b57F8e0Dd228D77a',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aSNX: {
    name: 'Aave SNX',
    code: 'aSNX',
    decimals: 18,
    contractAddress: '0x35f6B052C598d933D69A4EEC4D04c73A191fE6c2',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aSUSD: {
    name: 'Aave SUSD',
    code: 'aSUSD',
    decimals: 18,
    contractAddress: '0x6C5024Cd4F8A59110119C56f8933403A539555EB',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aTUSD: {
    name: 'Aave TUSD',
    code: 'aTUSD',
    decimals: 18,
    contractAddress: '0x101cc05f4A51C0319f570d5E146a8C625198e636',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aUNI: {
    name: 'Aave UNI',
    code: 'aUNI',
    decimals: 18,
    contractAddress: '0xB9D7CB55f463405CDfBe4E90a6D2Df01C2B92BF1',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aUSDC: {
    name: 'Aave USDC',
    code: 'aUSDC',
    decimals: 6,
    contractAddress: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aUSDT: {
    name: 'Aave USDT',
    code: 'aUSDT',
    decimals: 6,
    contractAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aWBTC: {
    name: 'Aave WBTC',
    code: 'aWBTC',
    decimals: 8,
    contractAddress: '0x9ff58f4fFB29fA2266Ab25e75e2A8b3503311656',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aWETH: {
    name: 'Aave WETH',
    code: 'aWETH',
    decimals: 18,
    contractAddress: '0x030bA81f1c18d280636F32af80b9AAd02Cf0854e',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aYFI: {
    name: 'Aave YFI',
    code: 'aYFI',
    decimals: 18,
    contractAddress: '0x5165d24277cD063F5ac44Efd447B27025e888f37',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  aZRX: {
    name: 'Aave ZRX',
    code: 'aZRX',
    decimals: 18,
    contractAddress: '0xDf7FF54aAcAcbFf42dfe29DD6144A69b629f8C9e',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  AAVE: {
    name: 'Aave',
    code: 'AAVE',
    decimals: 18,
    contractAddress: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    priceSource: {
      coinGeckoId: 'aave',
    },
  },
  stAAVE: {
    name: 'Staked Aave',
    code: 'stAAVE',
    decimals: 18,
    contractAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  LEND: {
    name: 'ETHLend Token',
    code: 'LEND',
    decimals: 18,
    contractAddress: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
    color: '#0fa9c9',
    priceSource: {
      coinGeckoId: 'ethlend',
    },
  },
  GLM: {
    name: 'Golem Network Token',
    code: 'GLM',
    decimals: 18,
    contractAddress: '0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429',
    priceSource: {
      coinGeckoId: 'golem',
    },
  },
  OCTO: {
    name: 'OctoFi',
    code: 'OCTO',
    decimals: 18,
    contractAddress: '0x7240aC91f01233BaAf8b064248E80feaA5912BA3',
    priceSource: {
      coinGeckoId: 'octofi',
    },
  },
  ORBS: {
    name: 'Orbs',
    code: 'ORBS',
    decimals: 18,
    contractAddress: '0xff56Cc6b1E6dEd347aA0B7676C85AB0B3D08B0FA',
    priceSource: {
      coinGeckoId: 'orbs',
    },
  },
  GAME: {
    name: 'GAME Credits',
    code: 'GAME',
    decimals: 18,
    contractAddress: '0x63f88A2298a5c4AEE3c216Aa6D926B184a4b2437',
    color: '#2d475b',
    priceSource: {
      coinGeckoId: 'gamecredits',
    },
  },
  DIA: {
    name: 'DIAdata',
    code: 'DIA',
    decimals: 18,
    contractAddress: '0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419',
    priceSource: {
      coinGeckoId: 'dia-data',
    },
  },
  MTL: {
    name: 'Metal',
    code: 'MTL',
    decimals: 8,
    contractAddress: '0xF433089366899D83a9f26A773D59ec7eCF30355e',
    color: '#1e1f25',
    priceSource: {
      coinGeckoId: 'metal',
    },
  },
  TBTC: {
    name: 'tBTC',
    code: 'TBTC',
    decimals: 18,
    contractAddress: '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa',
    priceSource: {
      coinGeckoId: 'tbtc',
    },
  },
  XPR: {
    name: 'Proton',
    code: 'XPR',
    decimals: 4,
    contractAddress: '0xD7EFB00d12C2c13131FD319336Fdf952525dA2af',
    priceSource: {
      coinGeckoId: 'proton',
    },
  },
  EWTB: {
    name: 'Energy Web Token Bridged',
    code: 'EWTB',
    decimals: 18,
    contractAddress: '0x178c820f862B14f316509ec36b13123DA19A6054',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  HEX: {
    name: 'HEX',
    code: 'HEX',
    decimals: 8,
    contractAddress: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39',
    priceSource: {
      coinGeckoId: 'hex',
    },
  },
  RARI: {
    name: 'Rarible',
    code: 'RARI',
    decimals: 18,
    contractAddress: '0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF',
    priceSource: {
      coinGeckoId: 'rarible',
    },
  },
  SNTVT: {
    name: 'Sentivate',
    code: 'SNTVT',
    decimals: 18,
    contractAddress: '0x7865af71cf0b288b4E7F654f4F7851EB46a2B7F8',
    priceSource: {
      coinGeckoId: 'sentivate',
    },
  },
  MET: {
    name: 'Metronome',
    code: 'MET',
    decimals: 18,
    contractAddress: '0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e',
    priceSource: {
      coinGeckoId: 'metronome',
    },
  },
  PLDAI: {
    name: 'PoolTogether Dai',
    code: 'PLDAI',
    decimals: 18,
    contractAddress: '0x49d716DFe60b37379010A75329ae09428f17118d',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  PLSAI: {
    name: 'PoolTogether Sai',
    code: 'PLSAI',
    decimals: 18,
    contractAddress: '0xfE6892654CBB05eB73d28DCc1Ff938f59666Fe9f',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  BLZ: {
    name: 'Bluzelle Token',
    code: 'BLZ',
    decimals: 18,
    contractAddress: '0x5732046A883704404F284Ce41FfADd5b007FD668',
    color: '#18578c',
    priceSource: {
      coinGeckoId: 'bluzelle',
    },
  },
  PLUSDC: {
    name: 'PoolTogether USDC',
    code: 'PLUSDC',
    decimals: 6,
    contractAddress: '0xBD87447F48ad729C5c4b8bcb503e1395F62e8B98',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  YFI: {
    name: 'yearn.finance',
    code: 'YFI',
    decimals: 18,
    contractAddress: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    color: '#006ae3',
    priceSource: {
      coinGeckoId: 'yearn-finance',
    },
  },
  rDAI: {
    name: 'rDAI',
    code: 'rDAI',
    decimals: 18,
    contractAddress: '0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0',
    priceSource: {
      coinGeckoId: 'rdai',
    },
  },
  rSAI: {
    name: 'rSAI',
    code: 'rSAI',
    decimals: 18,
    contractAddress: '0xea8b224eDD3e342DEb514C4176c2E72Bcce6fFF9',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  GRID: {
    name: 'GridPlus',
    code: 'GRID',
    decimals: 12,
    contractAddress: '0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD',
    priceSource: {
      coinGeckoId: 'grid',
    },
  },
  OXT: {
    name: 'Orchid',
    code: 'OXT',
    decimals: 18,
    contractAddress: '0x4575f41308EC1483f3d399aa9a2826d74Da13Deb',
    priceSource: {
      coinGeckoId: 'orchid-protocol',
    },
  },
  KEY: {
    name: 'Selfkey',
    code: 'KEY',
    decimals: 18,
    contractAddress: '0x4CC19356f2D37338b9802aa8E8fc58B0373296E7',
    priceSource: {
      coinGeckoId: 'selfkey',
    },
  },
  ERT: {
    name: 'Eristica',
    code: 'ERT',
    decimals: 18,
    contractAddress: '0x92A5B04D0ED5D94D7a193d1d334D3D16996f4E13',
    priceSource: {
      coinGeckoId: 'eristica',
    },
  },
  USDT: {
    name: 'Tether USD',
    code: 'USDT',
    decimals: 6,
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    color: '#26a17b',
    priceSource: {
      coinGeckoId: 'tether',
    },
  },
  CHAI: {
    name: 'Chai',
    code: 'CHAI',
    decimals: 18,
    contractAddress: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    priceSource: {
      coinGeckoId: 'chai',
    },
  },
  UMA: {
    name: 'UMA',
    code: 'UMA',
    decimals: 18,
    contractAddress: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
    priceSource: {
      coinGeckoId: 'uma',
    },
  },
  UPX: {
    name: 'UPX Token',
    code: 'UPX',
    decimals: 18,
    contractAddress: '0x5f778ec4B31a506c1Dfd8b06F131E9B451a61D39',
    priceSource: {
      coinGeckoId: 'udap',
    },
  },
  ENG: {
    name: 'Enigma',
    code: 'ENG',
    decimals: 18,
    contractAddress: '0xf0Ee6b27b759C9893Ce4f094b49ad28fd15A23e4',
    color: '#2f2f2f',
    priceSource: {
      coinGeckoId: 'enigma',
    },
  },
  CEL: {
    name: 'Celsius',
    code: 'CEL',
    decimals: 4,
    contractAddress: '0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d',
    priceSource: {
      coinGeckoId: 'celsius-degree-token',
    },
  },
  BTU: {
    name: 'BTU',
    code: 'BTU',
    decimals: 18,
    contractAddress: '0xb683D83a532e2Cb7DFa5275eED3698436371cc9f',
    priceSource: {
      coinGeckoId: 'btu-protocol',
    },
  },
  BOA: {
    name: 'BOSAGORA',
    code: 'BOA',
    decimals: 7,
    contractAddress: '0x746DdA2ea243400D5a63e0700F190aB79f06489e',
    priceSource: {
      coinGeckoId: 'bosagora',
    },
  },
  POP: {
    name: 'POP Network Token',
    code: 'POP',
    decimals: 18,
    contractAddress: '0x5D858bcd53E085920620549214a8b27CE2f04670',
    priceSource: {
      coinGeckoId: 'pop-chest-token',
    },
  },
  SKM: {
    name: 'Skrumble Network V2',
    code: 'SKM',
    decimals: 18,
    contractAddress: '0x048Fe49BE32adfC9ED68C37D32B5ec9Df17b3603',
    priceSource: {
      coinGeckoId: 'skrumble-network',
    },
  },
  ENQ: {
    name: 'Enecuum',
    code: 'ENQ',
    decimals: 10,
    contractAddress: '0x16EA01aCB4b0Bca2000ee5473348B6937ee6f72F',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  ZEON: {
    name: 'ZEON Network',
    code: 'ZEON',
    decimals: 18,
    contractAddress: '0xE5B826Ca2Ca02F09c1725e9bd98d9a8874C30532',
    priceSource: {
      coinGeckoId: 'zeon',
    },
  },
  REMI: {
    name: 'REMIIT REMI Token',
    code: 'REMI',
    decimals: 18,
    contractAddress: '0x13cb85823f78Cff38f0B0E90D3e975b8CB3AAd64',
    priceSource: {
      coinGeckoId: 'remiit',
    },
  },
  HAK: {
    name: 'Shaka',
    code: 'HAK',
    decimals: 18,
    contractAddress: '0x93a7174dafd31d13400cD9fa01f4e5B5BAa00D39',
    priceSource: {
      coinGeckoId: 'shaka',
    },
  },
  IOTX: {
    name: 'IoTeX',
    code: 'IOTX',
    decimals: 18,
    contractAddress: '0x6fB3e0A217407EFFf7Ca062D46c26E5d60a14d69',
    color: '#00d4d5',
    priceSource: {
      coinGeckoId: 'iotex',
    },
  },
  RAE: {
    name: 'RAE Token',
    code: 'RAE',
    decimals: 18,
    contractAddress: '0xE5a3229CCb22b6484594973A03a3851dCd948756',
    priceSource: {
      coinGeckoId: 'rae-token',
    },
  },
  ADXL: {
    name: 'AdEx Legacy Token',
    code: 'ADXL',
    decimals: 4,
    contractAddress: '0x4470BB87d77b963A013DB939BE332f927f2b992e',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  ADX: {
    name: 'AdEx Token',
    code: 'ADX',
    decimals: 18,
    contractAddress: '0xADE00C28244d5CE17D72E40330B1c318cD12B7c3',
    color: '#1b75bc',
    priceSource: {
      coinGeckoId: 'adex',
    },
  },
  NDX: {
    name: 'nDEX',
    code: 'NDX',
    decimals: 18,
    contractAddress: '0x1966d718A565566e8E202792658D7b5Ff4ECe469',
    priceSource: {
      coinGeckoId: 'ndex',
    },
  },
  WBTC: {
    name: 'Wrapped BTC',
    code: 'WBTC',
    decimals: 8,
    contractAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    priceSource: {
      coinGeckoId: 'wrapped-bitcoin',
    },
  },
  GOLD: {
    name: 'Dragonereum Gold',
    code: 'GOLD',
    decimals: 18,
    contractAddress: '0x150b0b96933B75Ce27af8b92441F8fB683bF9739',
    color: '#f1b32b',
    priceSource: {
      coinGeckoId: 'dragonereum-gold',
    },
  },
  DREAM: {
    name: 'DreamTeam Token',
    code: 'DREAM',
    decimals: 6,
    contractAddress: '0x82f4dED9Cec9B5750FBFf5C2185AEe35AfC16587',
    priceSource: {
      coinGeckoId: 'dreamteam',
    },
  },
  MYB: {
    name: 'MyBit',
    code: 'MYB',
    decimals: 18,
    contractAddress: '0x5d60d8d7eF6d37E16EBABc324de3bE57f135e0BC',
    priceSource: {
      coinGeckoId: 'mybit-token',
    },
  },
  CVL: {
    name: 'Civil Token',
    code: 'CVL',
    decimals: 18,
    contractAddress: '0x01FA555c97D7958Fa6f771f3BbD5CCD508f81e22',
    priceSource: {
      coinGeckoId: 'civil',
    },
  },
  DTH: {
    name: 'Dether',
    code: 'DTH',
    decimals: 18,
    contractAddress: '0x5adc961D6AC3f7062D2eA45FEFB8D8167d44b190',
    color: '#3c80f1',
    priceSource: {
      coinGeckoId: 'dether',
    },
  },
  WIB: {
    name: 'Wibson',
    code: 'WIB',
    decimals: 9,
    contractAddress: '0x3F17Dd476faF0a4855572F0B6ed5115D9bBA22AD',
    priceSource: {
      coinGeckoId: 'wibson',
    },
  },
  BOB: {
    name: "Bob's Repair",
    code: 'BOB',
    decimals: 18,
    contractAddress: '0xDF347911910b6c9A4286bA8E2EE5ea4a39eB2134',
    priceSource: {
      coinGeckoId: 'bobs_repair',
    },
  },
  SWM: {
    name: 'SWARM',
    code: 'SWM',
    decimals: 18,
    contractAddress: '0x3505F494c3f0fed0B594E01Fa41Dd3967645ca39',
    priceSource: {
      coinGeckoId: 'swarm',
    },
  },
  ONL: {
    name: 'On.Live',
    code: 'ONL',
    decimals: 18,
    contractAddress: '0x6863bE0e7CF7ce860A574760e9020D519a8bDC47',
    priceSource: {
      coinGeckoId: 'on-live',
    },
  },
  PARETO: {
    name: 'Pareto',
    code: 'PARETO',
    decimals: 18,
    contractAddress: '0xea5f88E54d982Cbb0c441cde4E79bC305e5b43Bc',
    priceSource: {
      coinGeckoId: 'pareto-network',
    },
  },
  HERC: {
    name: 'Hercules',
    code: 'HERC',
    decimals: 18,
    contractAddress: '0x2e91E3e54C5788e9FdD6A181497FDcEa1De1bcc1',
    priceSource: {
      coinGeckoId: 'hercules',
    },
  },
  FOAM: {
    name: 'FOAM',
    code: 'FOAM',
    decimals: 18,
    contractAddress: '0x4946Fcea7C692606e8908002e55A582af44AC121',
    priceSource: {
      coinGeckoId: 'foam-protocol',
    },
  },
  ONE: {
    name: 'Menlo One',
    code: 'ONE',
    decimals: 18,
    contractAddress: '0x4D807509aECe24C0fa5A102b6a3B059Ec6E14392',
    priceSource: {
      coinGeckoId: 'menlo-one',
    },
  },
  SPND: {
    name: 'Spendcoin',
    code: 'SPND',
    decimals: 18,
    contractAddress: '0xDDD460bBD9F79847ea08681563e8A9696867210C',
    priceSource: {
      coinGeckoId: 'spendcoin',
    },
  },
  AST: {
    name: 'AirSwap Token',
    code: 'AST',
    decimals: 4,
    contractAddress: '0x27054b13b1B798B345b591a4d22e6562d47eA75a',
    color: '#0061ff',
    priceSource: {
      coinGeckoId: 'airswap',
    },
  },
  RMESH: {
    name: 'RightMesh Token',
    code: 'RMESH',
    decimals: 18,
    contractAddress: '0x8D5682941cE456900b12d47ac06a88b47C764CE1',
    priceSource: {
      coinGeckoId: 'rightmesh',
    },
  },
  JOY: {
    name: 'JOYSO',
    code: 'JOY',
    decimals: 6,
    contractAddress: '0xDDe12a12A6f67156e0DA672be05c374e1B0a3e57',
    priceSource: {
      coinGeckoId: 'joyso',
    },
  },
  J8T: {
    name: 'JET8 Token',
    code: 'J8T',
    decimals: 8,
    contractAddress: '0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4',
    priceSource: {
      coinGeckoId: 'jet8',
    },
  },
  QNT: {
    name: 'Quant Network',
    code: 'QNT',
    decimals: 18,
    contractAddress: '0x4a220E6096B25EADb88358cb44068A3248254675',
    priceSource: {
      coinGeckoId: 'quant-network',
    },
  },
  XNK: {
    name: 'Ink Protocol',
    code: 'XNK',
    decimals: 18,
    contractAddress: '0xBC86727E770de68B1060C91f6BB6945c73e10388',
    priceSource: {
      coinGeckoId: 'ink-protocol',
    },
  },
  AION: {
    name: 'Aion Network',
    code: 'AION',
    decimals: 8,
    contractAddress: '0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466',
    color: '#00bfec',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  ELY: {
    name: 'ELY Token',
    code: 'ELY',
    decimals: 18,
    contractAddress: '0xa95592DCFfA3C080B4B40E459c5f5692F67DB7F8',
    priceSource: {
      coinGeckoId: 'elysian',
    },
  },
  NCT: {
    name: 'PolySwarm Nectar',
    code: 'NCT',
    decimals: 18,
    contractAddress: '0x9E46A38F5DaaBe8683E10793b06749EEF7D733d1',
    priceSource: {
      coinGeckoId: 'polyswarm',
    },
  },
  BOX: {
    name: 'BOX Token',
    code: 'BOX',
    decimals: 18,
    contractAddress: '0xe1A178B681BD05964d3e3Ed33AE731577d9d96dD',
    priceSource: {
      coinGeckoId: 'box-token',
    },
  },
  VDOC: {
    name: 'dutyof.care Token',
    code: 'VDOC',
    decimals: 18,
    contractAddress: '0x82BD526bDB718C6d4DD2291Ed013A5186cAE2DCa',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  RHOC: {
    name: 'Rhoc',
    code: 'RHOC',
    decimals: 8,
    contractAddress: '0x168296bb09e24A88805CB9c33356536B980D3fC5',
    color: '#cc1e46',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  GEN: {
    name: 'DAOstack',
    code: 'GEN',
    decimals: 18,
    contractAddress: '0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf',
    priceSource: {
      coinGeckoId: 'daostack',
    },
  },
  DGS: {
    name: 'Dragonglass',
    code: 'DGS',
    decimals: 8,
    contractAddress: '0x6aEDbF8dFF31437220dF351950Ba2a3362168d1b',
    priceSource: {
      coinGeckoId: 'dragonglass',
    },
  },
  OMG: {
    name: 'OmiseGO',
    code: 'OMG',
    decimals: 18,
    contractAddress: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
    color: '#1a53f0',
    priceSource: {
      coinGeckoId: 'omisego',
    },
  },
  QSP: {
    name: 'Quantstamp',
    code: 'QSP',
    decimals: 18,
    contractAddress: '0x99ea4dB9EE77ACD40B119BD1dC4E33e1C070b80d',
    color: '#454545',
    priceSource: {
      coinGeckoId: 'quantstamp',
    },
  },
  CLN: {
    name: 'Colu Local Network',
    code: 'CLN',
    decimals: 18,
    contractAddress: '0x4162178B78D6985480A308B2190EE5517460406D',
    priceSource: {
      coinGeckoId: 'colu',
    },
  },
  STORJ: {
    name: 'Storj',
    code: 'STORJ',
    decimals: 8,
    contractAddress: '0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC',
    color: '#2683ff',
    priceSource: {
      coinGeckoId: 'storj',
    },
  },
  MANA: {
    name: 'Decentraland',
    code: 'MANA',
    decimals: 18,
    contractAddress: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
    color: '#bfb5af',
    priceSource: {
      coinGeckoId: 'decentraland',
    },
  },
  XSC: {
    name: 'CrowdstartCoin',
    code: 'XSC',
    decimals: 18,
    contractAddress: '0x0F513fFb4926ff82D7F60A05069047AcA295C413',
    priceSource: {
      coinGeckoId: 'crowdstart-coin',
    },
  },
  ENTRP: {
    name: 'Hut34 Entropy Token',
    code: 'ENTRP',
    decimals: 18,
    contractAddress: '0x5BC7e5f0Ab8b2E10D2D0a3F21739FCe62459aeF3',
    color: '#fa5836',
    priceSource: {
      coinGeckoId: 'hut34-entropy',
    },
  },
  HYDRO: {
    name: 'Hydro',
    code: 'HYDRO',
    decimals: 18,
    contractAddress: '0xEBBdf302c940c6bfd49C6b165f457fdb324649bc',
    priceSource: {
      coinGeckoId: 'hydro',
    },
  },
  PKT: {
    name: 'Playkey Token',
    code: 'PKT',
    decimals: 18,
    contractAddress: '0x2604FA406Be957E542BEb89E6754fCdE6815e83f',
    priceSource: {
      coinGeckoId: 'playkey',
    },
  },
  ZRX: {
    name: '0x',
    code: 'ZRX',
    decimals: 18,
    contractAddress: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
    color: '#302c2c',
    priceSource: {
      coinGeckoId: '0x',
    },
  },
  REDC: {
    name: 'RedCab',
    code: 'REDC',
    decimals: 18,
    contractAddress: '0xB563300A3BAc79FC09B93b6F84CE0d4465A2AC27',
    priceSource: {
      coinGeckoId: 'redcab',
    },
  },
  MOD: {
    name: 'Modum Token',
    code: 'MOD',
    decimals: 0,
    contractAddress: '0x957c30aB0426e0C93CD8241E2c60392d08c6aC8e',
    color: '#09547d',
    priceSource: {
      coinGeckoId: 'modum',
    },
  },
  APPC: {
    name: 'AppCoins',
    code: 'APPC',
    decimals: 18,
    contractAddress: '0x1a7a8BD9106F2B8D977E08582DC7d24c723ab0DB',
    color: '#fd875e',
    priceSource: {
      coinGeckoId: 'appcoins',
    },
  },
  EURS: {
    name: 'STASIS EURS Token',
    code: 'EURS',
    decimals: 2,
    contractAddress: '0xdB25f211AB05b1c97D595516F45794528a807ad8',
    priceSource: {
      coinGeckoId: 'stasis-eurs',
    },
  },
  AMLT: {
    name: 'AMLT',
    code: 'AMLT',
    decimals: 18,
    contractAddress: '0xCA0e7269600d353F70b14Ad118A49575455C0f2f',
    priceSource: {
      coinGeckoId: 'coinfirm-amlt',
    },
  },
  SNX: {
    name: 'Synthetix Network Token',
    code: 'SNX',
    decimals: 18,
    contractAddress: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    priceSource: {
      coinGeckoId: 'havven',
    },
  },
  SUSD: {
    name: 'Synth sUSD',
    code: 'SUSD',
    decimals: 18,
    contractAddress: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
    priceSource: {
      coinGeckoId: 'nusd',
    },
  },
  SETH: {
    name: 'Synth sETH',
    code: 'SETH',
    decimals: 18,
    contractAddress: '0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb',
    priceSource: {
      coinGeckoId: 'seth',
    },
  },
  SBTC: {
    name: 'Synth sBTC',
    code: 'SBTC',
    decimals: 18,
    contractAddress: '0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6',
    priceSource: {
      coinGeckoId: 'sbtc',
    },
  },
  IQN: {
    name: 'IQeon',
    code: 'IQN',
    decimals: 18,
    contractAddress: '0x0DB8D8b76BC361bAcbB72E2C491E06085A97Ab31',
    priceSource: {
      coinGeckoId: 'iqeon',
    },
  },
  C10: {
    name: 'CRYPTO10 Hedged',
    code: 'C10',
    decimals: 18,
    contractAddress: '0x000C100050E98C91f9114fa5Dd75CE6869Bf4F53',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  C20: {
    name: 'Crypto20',
    code: 'C20',
    decimals: 18,
    contractAddress: '0x26E75307Fc0C021472fEb8F727839531F112f317',
    priceSource: {
      coinGeckoId: 'crypto20',
    },
  },
  PLAY: {
    name: 'Herocoin',
    code: 'PLAY',
    decimals: 18,
    contractAddress: '0xE477292f1B3268687A29376116B0ED27A9c76170',
    priceSource: {
      coinGeckoId: 'herocoin',
    },
  },
  GEE: {
    name: 'Geens Platform Token',
    code: 'GEE',
    decimals: 8,
    contractAddress: '0x4F4f0Db4de903B88f2B1a2847971E231D54F8fd3',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  MLN: {
    name: 'Melon',
    code: 'MLN',
    decimals: 18,
    contractAddress: '0xec67005c4E498Ec7f55E092bd1d35cbC47C91892',
    color: '#0b1529',
    priceSource: {
      coinGeckoId: 'melon',
    },
  },
  HGT: {
    name: 'HelloGold Token',
    code: 'HGT',
    decimals: 8,
    contractAddress: '0xba2184520A1cC49a6159c57e61E1844E085615B6',
    priceSource: {
      coinGeckoId: 'hellogold',
    },
  },
  GOLDX: {
    name: 'GOLDX',
    code: 'GOLDX',
    decimals: 18,
    contractAddress: '0xeAb43193CF0623073Ca89DB9B712796356FA7414',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  JET: {
    name: 'Jetcoin Institute Token',
    code: 'JET',
    decimals: 18,
    contractAddress: '0x8727c112C712c4a03371AC87a74dD6aB104Af768',
    priceSource: {
      coinGeckoId: 'jetcoin',
    },
  },
  IND: {
    name: 'Indorse Token',
    code: 'IND',
    decimals: 18,
    contractAddress: '0xf8e386EDa857484f5a12e4B5DAa9984E06E73705',
    priceSource: {
      coinGeckoId: 'indorse',
    },
  },
  NDC: {
    name: 'NEVERDIE Coin',
    code: 'NDC',
    decimals: 18,
    contractAddress: '0xA54ddC7B3CcE7FC8b1E3Fa0256D0DB80D2c10970',
    priceSource: {
      coinGeckoId: 'neverdie',
    },
  },
  BCPT: {
    name: 'BlockMason Credit Protocol Token',
    code: 'BCPT',
    decimals: 18,
    contractAddress: '0x1c4481750daa5Ff521A2a7490d9981eD46465Dbd',
    color: '#404040',
    priceSource: {
      coinGeckoId: 'blockmason-credit-protocol',
    },
  },
  SPN: {
    name: 'Sapien Network Token',
    code: 'SPN',
    decimals: 6,
    contractAddress: '0x20F7A3DdF244dc9299975b4Da1C39F8D5D75f05A',
    priceSource: {
      coinGeckoId: 'sapien',
    },
  },
  LOOM: {
    name: 'Loom Network Token',
    code: 'LOOM',
    decimals: 18,
    contractAddress: '0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0',
    color: '#48beff',
    priceSource: {
      coinGeckoId: 'loom-network',
    },
  },
  CELR: {
    name: 'Celer Network Token',
    code: 'CELR',
    decimals: 18,
    contractAddress: '0x4F9254C83EB525f9FCf346490bbb3ed28a81C667',
    priceSource: {
      coinGeckoId: 'celer-network',
    },
  },
  GLA: {
    name: 'Gladius',
    code: 'GLA',
    decimals: 8,
    contractAddress: '0x71D01dB8d6a2fBEa7f8d434599C237980C234e4C',
    priceSource: {
      coinGeckoId: 'gladius-token',
    },
  },
  KNC: {
    name: 'Kyber Network Crystal',
    code: 'KNC',
    decimals: 18,
    contractAddress: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
    color: '#188c92',
    priceSource: {
      coinGeckoId: 'kyber-network',
    },
  },
  BNT: {
    name: 'Bancor Network Token',
    code: 'BNT',
    decimals: 18,
    contractAddress: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
    color: '#000d2b',
    priceSource: {
      coinGeckoId: 'bancor',
    },
  },
  LUN: {
    name: 'Lunyr Token',
    code: 'LUN',
    decimals: 18,
    contractAddress: '0xfa05A73FfE78ef8f1a739473e462c54bae6567D9',
    color: '#f55749',
    priceSource: {
      coinGeckoId: 'lunyr',
    },
  },
  LEDU: {
    name: 'LEDU Token',
    code: 'LEDU',
    decimals: 8,
    contractAddress: '0xC741f06082AA47F93729070aD0dD95E223Bda091',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  VSL: {
    name: 'vSlice',
    code: 'VSL',
    decimals: 18,
    contractAddress: '0x5c543e7AE0A1104f78406C340E9C64FD9fCE5170',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  BCAP: {
    name: 'Blockchain Capital',
    code: 'BCAP',
    decimals: 0,
    contractAddress: '0x1f41E42D0a9e3c0Dd3BA15B527342783B43200A9',
    priceSource: {
      coinGeckoId: 'bcap',
    },
  },
  TIME: {
    name: 'Chronobank TIME',
    code: 'TIME',
    decimals: 8,
    contractAddress: '0x6531f133e6DeeBe7F2dcE5A0441aA7ef330B4e53',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  TAAS: {
    name: 'Token-as-a-Service',
    code: 'TAAS',
    decimals: 6,
    contractAddress: '0xE7775A6e9Bcf904eb39DA2b68c5efb4F9360e08C',
    color: '#002342',
    priceSource: {
      coinGeckoId: 'taas',
    },
  },
  TKN: {
    name: 'Monolith TKN',
    code: 'TKN',
    decimals: 8,
    contractAddress: '0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a',
    color: '#24dd7b',
    priceSource: {
      coinGeckoId: 'tokencard',
    },
  },
  EDG: {
    name: 'Edgeless',
    code: 'EDG',
    decimals: 0,
    contractAddress: '0x08711D3B02C8758F2FB3ab4e80228418a7F8e39c',
    color: '#2b1544',
    priceSource: {
      coinGeckoId: 'edgeless',
    },
  },
  GUP: {
    name: 'Guppy',
    code: 'GUP',
    decimals: 3,
    contractAddress: '0xf7B098298f7C69Fc14610bf71d5e02c60792894C',
    color: '#37dcd8',
    priceSource: {
      coinGeckoId: 'matchpool',
    },
  },
  XAUR: {
    name: 'Xaurum',
    code: 'XAUR',
    decimals: 8,
    contractAddress: '0x4DF812F6064def1e5e029f1ca858777CC98D2D81',
    priceSource: {
      coinGeckoId: 'xaurum',
    },
  },
  SWT: {
    name: 'Swarm City Token',
    code: 'SWT',
    decimals: 18,
    contractAddress: '0xB9e7F8568e08d5659f5D29C4997173d84CdF2607',
    priceSource: {
      coinGeckoId: 'swarm-city',
    },
  },
  TRST: {
    name: 'Trustcoin',
    code: 'TRST',
    decimals: 6,
    contractAddress: '0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B',
    priceSource: {
      coinGeckoId: 'wetrust',
    },
  },
  ANTv1: {
    name: 'Aragon Network Token v1',
    code: 'ANTv1',
    decimals: 18,
    contractAddress: '0x960b236A07cf122663c4303350609A66A7B288C0',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  WINGS: {
    name: 'WINGS',
    code: 'WINGS',
    decimals: 18,
    contractAddress: '0x667088b212ce3d06a1b553a7221E1fD19000d9aF',
    color: '#0dc9f7',
    priceSource: {
      coinGeckoId: 'wings',
    },
  },
  FKX: {
    name: 'Knoxstertoken',
    code: 'FKX',
    decimals: 18,
    contractAddress: '0x009e864923b49263c7F10D19B7f8Ab7a9A5AAd33',
    priceSource: {
      coinGeckoId: 'fortknoxter',
    },
  },
  '1ST': {
    name: 'FirstBlood Token',
    code: '1ST',
    decimals: 18,
    contractAddress: '0xAf30D2a7E90d7DC361c8C4585e9BB7D2F6f15bc7',
    priceSource: {
      coinGeckoId: 'first-blood',
    },
  },
  RLC: {
    name: 'iExec RLC Token',
    code: 'RLC',
    decimals: 9,
    contractAddress: '0x607F4C5BB672230e8672085532f7e901544a7375',
    color: '#ffd800',
    priceSource: {
      coinGeckoId: 'iexec-rlc',
    },
  },
  SNGLS: {
    name: 'SingularDTV',
    code: 'SNGLS',
    decimals: 0,
    contractAddress: '0xaeC2E87E0A235266D9C5ADc9DEb4b2E29b54D009',
    color: '#b30d23',
    priceSource: {
      coinGeckoId: 'singulardtv',
    },
  },
  ICN: {
    name: 'ICONOMI',
    code: 'ICN',
    decimals: 18,
    contractAddress: '0x888666CA69E0f178DED6D75b5726Cee99A87D698',
    color: '#4c6f8c',
    priceSource: {
      coinGeckoId: 'iconomi',
    },
  },
  DGD: {
    name: 'Digix',
    code: 'DGD',
    decimals: 9,
    contractAddress: '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A',
    color: '#f4d029',
    priceSource: {
      coinGeckoId: 'digixdao',
    },
  },
  MKR: {
    name: 'Maker',
    code: 'MKR',
    decimals: 18,
    contractAddress: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    color: '#1abc9c',
    priceSource: {
      coinGeckoId: 'maker',
    },
  },
  SAI: {
    name: 'Sai Stablecoin v1.0',
    code: 'SAI',
    decimals: 18,
    contractAddress: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    color: '#b68900',
    priceSource: {
      coinGeckoId: 'sai',
    },
  },
  DAI: {
    name: 'Dai Stablecoin',
    code: 'DAI',
    decimals: 18,
    contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    color: '#AB7E21',
    priceSource: {
      coinGeckoId: 'dai',
    },
  },
  AMPL: {
    name: 'Ampleforth',
    code: 'AMPL',
    decimals: 9,
    contractAddress: '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
    color: '#000000',
    priceSource: {
      coinGeckoId: 'ampleforth',
    },
  },
  MFT: {
    name: 'Mainframe Token',
    code: 'MFT',
    decimals: 18,
    contractAddress: '0xDF2C7238198Ad8B389666574f2d8bc411A4b7428',
    color: '#da1157',
    priceSource: {
      coinGeckoId: 'mainframe',
    },
  },
  BAT: {
    name: 'Basic Attention Token',
    code: 'BAT',
    decimals: 18,
    contractAddress: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
    color: '#ff5000',
    priceSource: {
      coinGeckoId: 'basic-attention-token',
    },
  },
  BEE: {
    name: 'BEE Token',
    code: 'BEE',
    decimals: 18,
    contractAddress: '0x4D8fc1453a0F359e99c9675954e656D80d996FbF',
    priceSource: {
      coinGeckoId: 'bee-token',
    },
  },
  GNO: {
    name: 'Gnosis Token',
    code: 'GNO',
    decimals: 18,
    contractAddress: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
    color: '#00a6c4',
    priceSource: {
      coinGeckoId: 'gnosis',
    },
  },
  LINK: {
    name: 'Chainlink Token',
    code: 'LINK',
    decimals: 18,
    contractAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    color: '#01a6fb',
    priceSource: {
      coinGeckoId: 'chainlink',
    },
  },
  PLU: {
    name: 'Pluton',
    code: 'PLU',
    decimals: 18,
    contractAddress: '0xD8912C10681D8B21Fd3742244f44658dBA12264E',
    priceSource: {
      coinGeckoId: 'pluton',
    },
  },
  REP: {
    name: 'Reputation Old',
    code: 'REP',
    decimals: 18,
    contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
    color: '#602a52',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  REPv2: {
    name: 'Reputation',
    code: 'REPv2',
    decimals: 18,
    contractAddress: '0x221657776846890989a759BA2973e427DfF5C9bB',
    priceSource: {
      coinGeckoId: 'augur',
    },
  },
  RFR: {
    name: 'Refereum',
    code: 'RFR',
    decimals: 4,
    contractAddress: '0xd0929d411954c47438dc1d871dd6081F5C5e149c',
    priceSource: {
      coinGeckoId: 'refereum',
    },
  },
  NFC: {
    name: 'NoFakeCoin',
    code: 'NFC',
    decimals: 18,
    contractAddress: '0xb0866289e870D2efc282406cF4123Df6E5BcB652',
    priceSource: {
      coinGeckoId: 'nofakecoin',
    },
  },
  OST: {
    name: 'Open Simple Token',
    code: 'OST',
    decimals: 18,
    contractAddress: '0x2C4e8f2D746113d0696cE89B35F0d8bF88E0AEcA',
    color: '#34445b',
    priceSource: {
      coinGeckoId: 'simple-token',
    },
  },
  REN: {
    name: 'Republic Token',
    code: 'REN',
    decimals: 18,
    contractAddress: '0x408e41876cCCDC0F92210600ef50372656052a38',
    color: '#001b3a',
    priceSource: {
      coinGeckoId: 'republic-protocol',
    },
  },
  renBTC: {
    name: 'renBTC',
    code: 'renBTC',
    decimals: 8,
    contractAddress: '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
    priceSource: {
      coinGeckoId: 'renbtc',
    },
  },
  renZEC: {
    name: 'renZEC',
    code: 'renZEC',
    decimals: 8,
    contractAddress: '0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2',
    priceSource: {
      coinGeckoId: 'renzec',
    },
  },
  renBCH: {
    name: 'renBCH',
    code: 'renBCH',
    decimals: 8,
    contractAddress: '0x459086F2376525BdCebA5bDDA135e4E9d3FeF5bf',
    priceSource: {
      coinGeckoId: 'renbch',
    },
  },
  renFIL: {
    name: 'renFIL',
    code: 'renFIL',
    decimals: 18,
    contractAddress: '0xD5147bc8e386d91Cc5DBE72099DAC6C9b99276F5',
    priceSource: {
      coinGeckoId: 'renfil',
    },
  },
  GNT: {
    name: 'Golem Network Token',
    code: 'GNT',
    decimals: 18,
    contractAddress: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
    color: '#001d57',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  SIG: {
    name: 'Spectiv Signal Token',
    code: 'SIG',
    decimals: 18,
    contractAddress: '0x6888a16eA9792c15A4DCF2f6C623D055c8eDe792',
    priceSource: {
      coinGeckoId: 'signal-token',
    },
  },
  QTUM: {
    name: 'Qtum',
    code: 'QTUM',
    decimals: 18,
    contractAddress: '0x9a642d6b3368ddc662CA244bAdf32cDA716005BC',
    color: '#2e9ad0',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  CAT: {
    name: 'BitClave',
    code: 'CAT',
    decimals: 18,
    contractAddress: '0x1234567461d3f8Db7496581774Bd869C83D51c93',
    priceSource: {
      coinGeckoId: 'bitclave',
    },
  },
  CAG: {
    name: 'Change Coin',
    code: 'CAG',
    decimals: 18,
    contractAddress: '0x7d4b8Cce0591C9044a22ee543533b72E976E36C3',
    priceSource: {
      coinGeckoId: 'change',
    },
  },
  CAN: {
    name: 'CanYaCoin',
    code: 'CAN',
    decimals: 6,
    contractAddress: '0x1d462414fe14cf489c7A21CaC78509f4bF8CD7c0',
    priceSource: {
      coinGeckoId: 'canyacoin',
    },
  },
  RVT: {
    name: 'Rivetz',
    code: 'RVT',
    decimals: 18,
    contractAddress: '0x3d1BA9be9f66B8ee101911bC36D3fB562eaC2244',
    priceSource: {
      coinGeckoId: 'rivetz',
    },
  },
  WYV: {
    name: 'Project Wyvern Token',
    code: 'WYV',
    decimals: 18,
    contractAddress: '0x056017c55aE7AE32d12AeF7C679dF83A85ca75Ff',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  ART: {
    name: 'Maecenas ART Token',
    code: 'ART',
    decimals: 18,
    contractAddress: '0xfec0cF7fE078a500abf15F1284958F22049c2C7e',
    priceSource: {
      coinGeckoId: 'maecenas',
    },
  },
  ZIL: {
    name: 'Zilliqa',
    code: 'ZIL',
    decimals: 12,
    contractAddress: '0x05f4a42e251f2d52b8ed15E9FEdAacFcEF1FAD27',
    color: '#49c1bf',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  BMX: {
    name: 'BitMartToken',
    code: 'BMX',
    decimals: 18,
    contractAddress: '0x986EE2B944c42D017F52Af21c4c69B84DBeA35d8',
    priceSource: {
      coinGeckoId: 'bitmart-token',
    },
  },
  VIEW: {
    name: 'Viewly',
    code: 'VIEW',
    decimals: 18,
    contractAddress: '0xF03f8D65BaFA598611C3495124093c56e8F638f0',
    priceSource: {
      coinGeckoId: 'viewly',
    },
  },
  WETH: {
    name: 'Wrapped Ether',
    code: 'WETH',
    decimals: 18,
    contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    priceSource: {
      coinGeckoId: 'weth',
    },
  },
  cBAT: {
    name: 'Compound Basic Attention Token',
    code: 'cBAT',
    decimals: 8,
    contractAddress: '0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E',
    priceSource: {
      coinGeckoId: 'compound-basic-attention-token',
    },
  },
  cDAI: {
    name: 'Compound Dai',
    code: 'cDAI',
    decimals: 8,
    contractAddress: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
    priceSource: {
      coinGeckoId: 'cdai',
    },
  },
  cSAI: {
    name: 'Compound Sai (Legacy Dai)',
    code: 'cSAI',
    decimals: 8,
    contractAddress: '0xF5DCe57282A584D2746FaF1593d3121Fcac444dC',
    priceSource: {
      coinGeckoId: 'compound-sai',
    },
  },
  cETH: {
    name: 'Compound Ether',
    code: 'cETH',
    decimals: 8,
    contractAddress: '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5',
    priceSource: {
      coinGeckoId: 'compound-ether',
    },
  },
  cREP: {
    name: 'Compound Augur',
    code: 'cREP',
    decimals: 8,
    contractAddress: '0x158079Ee67Fce2f58472A96584A73C7Ab9AC95c1',
    priceSource: {
      coinGeckoId: 'compound-augur',
    },
  },
  cUSDC: {
    name: 'Compound USD Coin',
    code: 'cUSDC',
    decimals: 8,
    contractAddress: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
    priceSource: {
      coinGeckoId: 'compound-usd-coin',
    },
  },
  cUSDT: {
    name: 'Compound Tether',
    code: 'cUSDT',
    decimals: 8,
    contractAddress: '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9',
    priceSource: {
      coinGeckoId: 'compound-usdt',
    },
  },
  cWBTC: {
    name: 'Compound Wrapped BTC',
    code: 'cWBTC',
    decimals: 8,
    contractAddress: '0xC11b1268C1A384e55C48c2391d8d480264A3A7F4',
    priceSource: {
      coinGeckoId: 'compound-wrapped-btc',
    },
  },
  cZRX: {
    name: 'Compound 0x',
    code: 'cZRX',
    decimals: 8,
    contractAddress: '0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407',
    priceSource: {
      coinGeckoId: 'compound-0x',
    },
  },
  COMP: {
    name: 'Compound',
    code: 'COMP',
    decimals: 18,
    contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    priceSource: {
      coinGeckoId: 'compound-governance-token',
    },
  },
  NANJ: {
    name: 'NANJCOIN',
    code: 'NANJ',
    decimals: 8,
    contractAddress: '0xFFE02ee4C69eDf1b340fCaD64fbd6b37a7b9e265',
    priceSource: {
      coinGeckoId: 'nanjcoin',
    },
  },
  '0xBTC': {
    name: '0xBitcoin Token',
    code: '0xBTC',
    decimals: 8,
    contractAddress: '0xB6eD7644C69416d67B522e20bC294A9a9B405B31',
    priceSource: {
      coinGeckoId: 'oxbitcoin',
    },
  },
  SNT: {
    name: 'Status Network Token',
    code: 'SNT',
    decimals: 18,
    contractAddress: '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E',
    color: '#5b6dee',
    priceSource: {
      coinGeckoId: 'status',
    },
  },
  SPANK: {
    name: 'SPANK',
    code: 'SPANK',
    decimals: 18,
    contractAddress: '0x42d6622deCe394b54999Fbd73D108123806f6a18',
    color: '#ff3b81',
    priceSource: {
      coinGeckoId: 'spankchain',
    },
  },
  BOOTY: {
    name: 'BOOTY',
    code: 'BOOTY',
    decimals: 18,
    contractAddress: '0x6B01c3170ae1EFEBEe1a3159172CB3F7A5ECf9E5',
    color: '#00b4f4',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  BBK: {
    name: 'Brickblock',
    code: 'BBK',
    decimals: 18,
    contractAddress: '0x4a6058666cf1057eaC3CD3A5a614620547559fc9',
    priceSource: {
      coinGeckoId: 'brickblock',
    },
  },
  IMP: {
    name: 'Ether Kingdoms Token',
    code: 'IMP',
    decimals: 7,
    contractAddress: '0x48FF53777F747cFB694101222a944dE070c15D36',
    priceSource: {
      coinGeckoId: 'ether-kingdoms-token',
    },
  },
  LIKE: {
    name: 'LikeCoin',
    code: 'LIKE',
    decimals: 18,
    contractAddress: '0x02F61Fd266DA6E8B102D4121f5CE7b992640CF98',
    priceSource: {
      coinGeckoId: 'likecoin-erc20',
    },
  },
  VEN: {
    name: 'VeChain',
    code: 'VEN',
    decimals: 18,
    contractAddress: '0xD850942eF8811f2A866692A623011bDE52a462C1',
    priceSource: {
      coinGeckoId: 'vechain-old-erc20',
    },
  },
  ICX: {
    name: 'ICON',
    code: 'ICX',
    decimals: 18,
    contractAddress: '0xb5A5F22694352C15B00323844aD545ABb2B11028',
    color: '#1fc5c9',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  AERGO: {
    name: 'Aergo',
    code: 'AERGO',
    decimals: 18,
    contractAddress: '0x91Af0fBB28ABA7E31403Cb457106Ce79397FD4E6',
    priceSource: {
      coinGeckoId: 'aergo',
    },
  },
  AE: {
    name: 'Aeternity',
    code: 'AE',
    decimals: 18,
    contractAddress: '0x5CA9a71B1d01849C0a95490Cc00559717fCF0D1d',
    color: '#de3f6b',
    priceSource: {
      coinGeckoId: 'aeternity',
    },
  },
  PPT: {
    name: 'Populous',
    code: 'PPT',
    decimals: 8,
    contractAddress: '0xd4fa1460F537bb9085d22C7bcCB5DD450Ef28e3a',
    color: '#152743',
    priceSource: {
      coinGeckoId: 'populous',
    },
  },
  IOST: {
    name: 'IOST',
    code: 'IOST',
    decimals: 18,
    contractAddress: '0xFA1a856Cfa3409CFa145Fa4e20Eb270dF3EB21ab',
    color: '#1c1c1c',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  KCS: {
    name: 'Kucoin Shares',
    code: 'KCS',
    decimals: 6,
    contractAddress: '0x039B5649A59967e3e936D7471f9c3700100Ee1ab',
    color: '#0093dd',
    priceSource: {
      coinGeckoId: 'kucoin-shares',
    },
  },
  MITH: {
    name: 'Mithril',
    code: 'MITH',
    decimals: 18,
    contractAddress: '0x3893b9422Cd5D70a81eDeFfe3d5A1c6A978310BB',
    color: '#00316d',
    priceSource: {
      coinGeckoId: 'mithril',
    },
  },
  WTC: {
    name: 'Walton',
    code: 'WTC',
    decimals: 18,
    contractAddress: '0xb7cB1C96dB6B22b0D3d9536E0108d062BD488F74',
    color: '#8200ff',
    priceSource: {
      coinGeckoId: 'waltonchain',
    },
  },
  NMR: {
    name: 'Numeraire',
    code: 'NMR',
    decimals: 18,
    contractAddress: '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671',
    priceSource: {
      coinGeckoId: 'numeraire',
    },
  },
  GUSD: {
    name: 'Gemini Dollar',
    code: 'GUSD',
    decimals: 2,
    contractAddress: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
    color: '#00dcfa',
    priceSource: {
      coinGeckoId: 'gemini-dollar',
    },
  },
  USDC: {
    name: 'USD Coin',
    code: 'USDC',
    decimals: 6,
    contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    color: '#2775c9',
    priceSource: {
      coinGeckoId: 'usd-coin',
    },
  },
  PNK: {
    name: 'Pinakion Token',
    code: 'PNK',
    decimals: 18,
    contractAddress: '0x93ED3FBe21207Ec2E8f2d3c3de6e058Cb73Bc04d',
    priceSource: {
      coinGeckoId: 'kleros',
    },
  },
  FUN: {
    name: 'FunFair',
    code: 'FUN',
    decimals: 8,
    contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b',
    color: '#ed1968',
    priceSource: {
      coinGeckoId: 'funfair',
    },
  },
  YEED: {
    name: 'YGGDRASH YEED Token',
    code: 'YEED',
    decimals: 18,
    contractAddress: '0xcA2796F9F61dc7b238Aab043971e49c6164DF375',
    priceSource: {
      coinGeckoId: 'yggdrash',
    },
  },
  DSCP: {
    name: 'Disciplina Token',
    code: 'DSCP',
    decimals: 18,
    contractAddress: '0x03e3f0c25965f13DbbC58246738C183E27b26a56',
    priceSource: {
      coinGeckoId: 'disciplina-project-by-teachmeplease',
    },
  },
  DAY: {
    name: 'Chronologic DAY Token',
    code: 'DAY',
    decimals: 18,
    contractAddress: '0xE814aeE960a85208C3dB542C53E7D4a6C8D5f60F',
    priceSource: {
      coinGeckoId: 'chronologic',
    },
  },
  PLAT: {
    name: 'PLATINUM',
    code: 'PLAT',
    decimals: 18,
    contractAddress: '0x7E43581b19ab509BCF9397a2eFd1ab10233f27dE',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  PAX: {
    name: 'PAX Stablecoin',
    code: 'PAX',
    decimals: 18,
    contractAddress: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
    color: '#ede708',
    priceSource: {
      coinGeckoId: 'paxos-standard',
    },
  },
  PAXG: {
    name: 'PAX Gold',
    code: 'PAXG',
    decimals: 18,
    contractAddress: '0x45804880De22913dAFE09f4980848ECE6EcbAf78',
    priceSource: {
      coinGeckoId: 'pax-gold',
    },
  },
  TUSD: {
    name: 'TrueUSD',
    code: 'TUSD',
    decimals: 18,
    contractAddress: '0x0000000000085d4780B73119b644AE5ecd22b376',
    color: '#2b2e7f',
    priceSource: {
      coinGeckoId: 'true-usd',
    },
  },
  BUSD: {
    name: 'Binance USD',
    code: 'BUSD',
    decimals: 18,
    contractAddress: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    priceSource: {
      coinGeckoId: 'binance-usd',
    },
  },
  MAS: {
    name: 'MidasProtocol',
    code: 'MAS',
    decimals: 18,
    contractAddress: '0x23Ccc43365D9dD3882eab88F43d515208f832430',
    priceSource: {
      coinGeckoId: 'midas-protocol',
    },
  },
  ROCK2: {
    name: 'ICE ROCK MINING',
    code: 'ROCK2',
    decimals: 0,
    contractAddress: '0xC16b542ff490e01fcc0DC58a60e1EFdc3e357cA6',
    priceSource: {
      coinGeckoId: 'ice-rock-mining',
    },
  },
  POA20: {
    name: 'POA20 Token',
    code: 'POA20',
    decimals: 18,
    contractAddress: '0x6758B7d441a9739b98552B373703d8d3d14f9e62',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  LTO: {
    name: 'LTO Network Token',
    code: 'LTO',
    decimals: 8,
    contractAddress: '0x3DB6Ba6ab6F95efed1a6E794caD492fAAabF294D',
    priceSource: {
      coinGeckoId: 'lto-network',
    },
  },
  VIDT: {
    name: 'VIDT Datalink',
    code: 'VIDT',
    decimals: 18,
    contractAddress: '0xfeF4185594457050cC9c23980d301908FE057Bb1',
    priceSource: {
      coinGeckoId: 'v-id-blockchain',
    },
  },
  CPLO: {
    name: 'Cpollo',
    code: 'CPLO',
    decimals: 18,
    contractAddress: '0x7064aAb39A0Fcf7221c3396719D0917a65E35515',
    priceSource: {
      coinGeckoId: 'cpollo',
    },
  },
  NEEO: {
    name: 'NEEO',
    code: 'NEEO',
    decimals: 18,
    contractAddress: '0xd8446236FA95b9b5f9fd0f8E7Df1a944823c683d',
    priceSource: {
      coinGeckoId: 'neeo-token',
    },
  },
  NEU: {
    name: 'Neumark',
    code: 'NEU',
    decimals: 18,
    contractAddress: '0xA823E6722006afe99E91c30FF5295052fe6b8E32',
    color: '#b3ba00',
    priceSource: {
      coinGeckoId: 'neumark',
    },
  },
  DATA: {
    name: 'Streamr',
    code: 'DATA',
    decimals: 18,
    contractAddress: '0x0Cf0Ee63788A0849fE5297F3407f701E122cC023',
    color: '#e9570f',
    priceSource: {
      coinGeckoId: 'streamr-datacoin',
    },
  },
  CRO: {
    name: 'Crypto.com Chain',
    code: 'CRO',
    decimals: 8,
    contractAddress: '0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b',
    priceSource: {
      coinGeckoId: 'crypto-com-chain',
    },
  },
  STAR: {
    name: 'STAR',
    code: 'STAR',
    decimals: 18,
    contractAddress: '0xF70a642bD387F94380fFb90451C2c81d4Eb82CBc',
    priceSource: {
      coinGeckoId: 'starbase',
    },
  },
  SAN: {
    name: 'Santiment',
    code: 'SAN',
    decimals: 18,
    contractAddress: '0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098',
    color: '#2b77b3',
    priceSource: {
      coinGeckoId: 'santiment-network-token',
    },
  },
  LPT: {
    name: 'Livepeer',
    code: 'LPT',
    decimals: 18,
    contractAddress: '0x58b6A8A3302369DAEc383334672404Ee733aB239',
    color: '#000000',
    priceSource: {
      coinGeckoId: 'livepeer',
    },
  },
  PROPS: {
    name: 'Props',
    code: 'PROPS',
    decimals: 18,
    contractAddress: '0x6fe56C0bcdD471359019FcBC48863d6c3e9d4F41',
    priceSource: {
      coinGeckoId: 'props',
    },
  },
  HOT: {
    name: 'HoloToken',
    code: 'HOT',
    decimals: 18,
    contractAddress: '0x6c6EE5e31d828De241282B9606C8e98Ea48526E2',
    color: '#8834ff',
    priceSource: {
      coinGeckoId: 'holotoken',
    },
  },
  ENJ: {
    name: 'Enjin Coin',
    code: 'ENJ',
    decimals: 18,
    contractAddress: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',
    color: '#624dbf',
    priceSource: {
      coinGeckoId: 'enjincoin',
    },
  },
  ELF: {
    name: 'AELF',
    code: 'ELF',
    decimals: 18,
    contractAddress: '0xbf2179859fc6D5BEE9Bf9158632Dc51678a4100e',
    color: '#2b5ebb',
    priceSource: {
      coinGeckoId: 'aelf',
    },
  },
  WAX: {
    name: 'Wax',
    code: 'WAX',
    decimals: 8,
    contractAddress: '0x39Bb259F66E1C59d5ABEF88375979b4D20D98022',
    color: '#f89022',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  POWR: {
    name: 'PowerLedger',
    code: 'POWR',
    decimals: 6,
    contractAddress: '0x595832F8FC6BF59c85C527fEC3740A1b7a361269',
    color: '#05bca9',
    priceSource: {
      coinGeckoId: 'power-ledger',
    },
  },
  XBP: {
    name: 'BlitzPredict',
    code: 'XBP',
    decimals: 18,
    contractAddress: '0x28dee01D53FED0Edf5f6E310BF8Ef9311513Ae40',
    color: '#21af67',
    priceSource: {
      coinGeckoId: 'blitzpredict',
    },
  },
  KODA: {
    name: 'KnownOrigin',
    code: 'KODA',
    decimals: 0,
    contractAddress: '0xFBeef911Dc5821886e1dda71586d90eD28174B7d',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  OGN: {
    name: 'Origin Protocol',
    code: 'OGN',
    decimals: 18,
    contractAddress: '0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26',
    priceSource: {
      coinGeckoId: 'origin-protocol',
    },
  },
  REQ: {
    name: 'Request',
    code: 'REQ',
    decimals: 18,
    contractAddress: '0x8f8221aFbB33998d8584A2B05749bA73c37a938a',
    color: '#00e6a0',
    priceSource: {
      coinGeckoId: 'request-network',
    },
  },
  BETHER: {
    name: 'Bethereum',
    code: 'BETHER',
    decimals: 18,
    contractAddress: '0x14C926F2290044B647e1Bf2072e67B495eff1905',
    priceSource: {
      coinGeckoId: 'bethereum',
    },
  },
  HUNT: {
    name: 'Hunt Token',
    code: 'HUNT',
    decimals: 18,
    contractAddress: '0x9AAb071B4129B083B01cB5A0Cb513Ce7ecA26fa5',
    priceSource: {
      coinGeckoId: 'hunt-token',
    },
  },
  METM: {
    name: 'Metamorph',
    code: 'METM',
    decimals: 18,
    contractAddress: '0xFEF3884b603C33EF8eD4183346E093A173C94da6',
    priceSource: {
      coinGeckoId: 'metamorph',
    },
  },
  DNT: {
    name: 'district0x',
    code: 'DNT',
    decimals: 18,
    contractAddress: '0x0AbdAce70D3790235af448C88547603b945604ea',
    color: '#2c398f',
    priceSource: {
      coinGeckoId: 'district0x',
    },
  },
  NUSD: {
    name: 'Neutral Dollar',
    code: 'NUSD',
    decimals: 6,
    contractAddress: '0x0C6144c16af288948C8fdB37fD8fEc94bfF3d1d9',
    priceSource: {
      coinGeckoId: 'neutral-dollar',
    },
  },
  MINDS: {
    name: 'Minds',
    code: 'MINDS',
    decimals: 18,
    contractAddress: '0xB26631c6dda06aD89B93C71400D25692de89c068',
    priceSource: {
      coinGeckoId: 'minds',
    },
  },
  SOUL: {
    name: 'CryptoSoul',
    code: 'SOUL',
    decimals: 18,
    contractAddress: '0xBb1f24C0c1554b9990222f036b0AaD6Ee4CAec29',
    priceSource: {
      coinGeckoId: 'cryptosoul',
    },
  },
  OGO: {
    name: 'Origo',
    code: 'OGO',
    decimals: 18,
    contractAddress: '0xFF0E5e014cf97e0615cb50F6f39Da6388E2FaE6E',
    priceSource: {
      coinGeckoId: 'origo',
    },
  },
  DANK: {
    name: 'DANKToken',
    code: 'DANK',
    decimals: 18,
    contractAddress: '0x0cB8D0B37C7487b11d57F1f33dEfA2B1d3cFccfE',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  PLA: {
    name: 'PlayDapp Token',
    code: 'PLA',
    decimals: 18,
    contractAddress: '0x3a4f40631a4f906c2BaD353Ed06De7A5D3fCb430',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  STMX: {
    name: 'StormX Token',
    code: 'STMX',
    decimals: 18,
    contractAddress: '0xbE9375C6a420D2eEB258962efB95551A5b722803',
    priceSource: {
      coinGeckoId: 'storm',
    },
  },
  WMATIC: {
    name: 'Matic Token',
    code: 'WMATIC',
    decimals: 18,
    contractAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    color: '#2b6def',
    priceSource: {
      coinGeckoId: 'matic-network',
    },
  },
  POLY: {
    name: 'Polymath',
    code: 'POLY',
    decimals: 18,
    contractAddress: '0x9992eC3cF6A55b00978cdDF2b27BC6882d88D1eC',
    color: '#4c5a95',
    priceSource: {
      coinGeckoId: 'polymath-network',
    },
  },
  LGO: {
    name: 'LGO Token',
    code: 'LGO',
    decimals: 8,
    contractAddress: '0x0a50C93c762fDD6E56D86215C24AaAD43aB629aa',
    priceSource: {
      coinGeckoId: 'legolas-exchange',
    },
  },
  LVN: {
    name: 'LivenCoin',
    code: 'LVN',
    decimals: 18,
    contractAddress: '0xc8Cac7672f4669685817cF332a33Eb249F085475',
    priceSource: {
      coinGeckoId: 'livenpay',
    },
  },
  LRC: {
    name: 'Loopring',
    code: 'LRC',
    decimals: 18,
    contractAddress: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
    color: '#2ab6f6',
    priceSource: {
      coinGeckoId: 'loopring',
    },
  },
  RDN: {
    name: 'Raiden Network Token',
    code: 'RDN',
    decimals: 18,
    contractAddress: '0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6',
    color: '#2a2a2a',
    priceSource: {
      coinGeckoId: 'raiden-network',
    },
  },
  LMY: {
    name: 'Lunch Money',
    code: 'LMY',
    decimals: 18,
    contractAddress: '0x66fD97a78d8854fEc445cd1C80a07896B0b4851f',
    priceSource: {
      coinGeckoId: 'lunch-money',
    },
  },
  TLN: {
    name: 'Trustlines Network Token',
    code: 'TLN',
    decimals: 18,
    contractAddress: '0x679131F591B4f369acB8cd8c51E68596806c3916',
    priceSource: {
      coinGeckoId: 'trustline-network',
    },
  },
  TOP: {
    name: 'TOP Network Token',
    code: 'TOP',
    decimals: 18,
    contractAddress: '0xdcD85914b8aE28c1E62f1C488E1D968D5aaFfE2b',
    priceSource: {
      coinGeckoId: 'top-network',
    },
  },
  FET: {
    name: 'Fetch',
    code: 'FET',
    decimals: 18,
    contractAddress: '0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85',
    priceSource: {
      coinGeckoId: 'fetch-ai',
    },
  },
  MTLX: {
    name: 'Mettalex',
    code: 'MTLX',
    decimals: 18,
    contractAddress: '0x2e1E15C44Ffe4Df6a0cb7371CD00d5028e571d14',
    priceSource: {
      coinGeckoId: 'mettalex',
    },
  },
  UNI: {
    name: 'Uniswap',
    code: 'UNI',
    decimals: 18,
    contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    priceSource: {
      coinGeckoId: 'uniswap',
    },
  },
  YFDOT: {
    name: 'Yearn Finance Dot',
    code: 'YFDOT',
    decimals: 18,
    contractAddress: '0x2e6539edc3b76f1E21B71d214527FAbA875F70F3',
    priceSource: {
      coinGeckoId: 'yearn-finance-dot',
    },
  },
  KTON: {
    name: 'Darwinia Commitment Token',
    code: 'KTON',
    decimals: 18,
    contractAddress: '0x9F284E1337A815fe77D2Ff4aE46544645B20c5ff',
    priceSource: {
      coinGeckoId: 'darwinia-commitment-token',
    },
  },
  '2KEY': {
    name: 'TwoKeyEconomy',
    code: '2KEY',
    decimals: 18,
    contractAddress: '0xE48972fCd82a274411c01834e2f031D4377Fa2c0',
    priceSource: {
      coinGeckoId: '2key',
    },
  },
  STAKE: {
    name: 'STAKE Token',
    code: 'STAKE',
    decimals: 18,
    contractAddress: '0x0Ae055097C6d159879521C384F1D2123D1f195e6',
    priceSource: {
      coinGeckoId: 'xdai-stake',
    },
  },
  DKA: {
    name: 'dKargo',
    code: 'DKA',
    decimals: 18,
    contractAddress: '0x5dc60C4D5e75D22588FA17fFEB90A63E535efCE0',
    priceSource: {
      coinGeckoId: 'dkargo',
    },
  },
  RING: {
    name: 'Darwinia Network Native Token',
    code: 'RING',
    decimals: 18,
    contractAddress: '0x9469D013805bFfB7D3DEBe5E7839237e535ec483',
    priceSource: {
      coinGeckoId: 'darwinia-network-native-token',
    },
  },
  ROOBEE: {
    name: 'ROOBEE',
    code: 'ROOBEE',
    decimals: 18,
    contractAddress: '0xA31B1767e09f842ECFd4bc471Fe44F830E3891AA',
    priceSource: {
      coinGeckoId: 'roobee',
    },
  },
  ZCRT: {
    name: 'ZCore Token',
    code: 'ZCRT',
    decimals: 18,
    contractAddress: '0xC7e43A1c8E118aA2965F5EAbe0e718D83DB7A63C',
    priceSource: {
      coinGeckoId: 'zcore-token',
    },
  },
  DCN: {
    name: 'Dentacoin Token',
    code: 'DCN',
    decimals: 0,
    contractAddress: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6',
    color: '#136485',
    priceSource: {
      coinGeckoId: 'dentacoin',
    },
  },
  mUSD: {
    name: 'mStable USD',
    code: 'mUSD',
    decimals: 18,
    contractAddress: '0xe2f2a5C287993345a840Db3B0845fbC70f5935a5',
    priceSource: {
      coinGeckoId: 'musd',
    },
  },
  MTA: {
    name: 'Meta',
    code: 'MTA',
    decimals: 18,
    contractAddress: '0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2',
    priceSource: {
      coinGeckoId: 'meta',
    },
  },
  PLR: {
    name: 'Pillar',
    code: 'PLR',
    decimals: 18,
    contractAddress: '0xe3818504c1B32bF1557b16C238B2E01Fd3149C17',
    color: '#00bfff',
    priceSource: {
      coinGeckoId: 'pillar',
    },
  },
  BAL: {
    name: 'Balancer (BAL)',
    code: 'BAL',
    decimals: 18,
    contractAddress: '0xba100000625a3754423978a60c9317c58a424e3D',
    priceSource: {
      coinGeckoId: 'balancer',
    },
  },
  GET: {
    name: 'Guaranteed Entrance Token',
    code: 'GET',
    decimals: 18,
    contractAddress: '0x8a854288a5976036A725879164Ca3e91d30c6A1B',
    priceSource: {
      coinGeckoId: 'get-token',
    },
  },
  AUC: {
    name: 'Auctus',
    code: 'AUC',
    decimals: 18,
    contractAddress: '0xc12d099be31567add4e4e4d0D45691C3F58f5663',
    priceSource: {
      coinGeckoId: 'auctus',
    },
  },
  HUSD: {
    name: 'HUSD',
    code: 'HUSD',
    decimals: 8,
    contractAddress: '0xdF574c24545E5FfEcb9a659c229253D4111d87e1',
    priceSource: {
      coinGeckoId: 'husd',
    },
  },
  BC: {
    name: 'Block-Chain.com Token',
    code: 'BC',
    decimals: 18,
    contractAddress: '0x2ecB13A8c458c379c4d9a7259e202De03c8F3D19',
    priceSource: {
      coinGeckoId: 'block-chain-com',
    },
  },
  CVP: {
    name: 'Concentrated Voting Power',
    code: 'CVP',
    decimals: 18,
    contractAddress: '0x38e4adB44ef08F22F5B5b76A8f0c2d0dCbE7DcA1',
    priceSource: {
      coinGeckoId: 'concentrated-voting-power',
    },
  },
  ANT: {
    name: 'Aragon Network Token',
    code: 'ANT',
    decimals: 18,
    contractAddress: '0xa117000000f279D81A1D3cc75430fAA017FA5A2e',
    color: '#2cd3e1',
    priceSource: {
      coinGeckoId: 'aragon',
    },
  },
  WIS: {
    name: 'Experty Wisdom Token',
    code: 'WIS',
    decimals: 18,
    contractAddress: '0xDecade1c6Bf2cD9fb89aFad73e4a519C867adcF5',
    priceSource: {
      coinGeckoId: 'experty-wisdom-token',
    },
  },
  AXN: {
    name: 'Axion',
    code: 'AXN',
    decimals: 18,
    contractAddress: '0x7D85e23014F84E6E21d5663aCD8751bEF3562352',
    priceSource: {
      coinGeckoId: undefined,
    },
  },
  NEXO: {
    name: 'NEXO',
    code: 'NEXO',
    decimals: 18,
    contractAddress: '0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206',
    color: '#1a4199',
    priceSource: {
      coinGeckoId: 'nexo',
    },
  },
  CAMP: {
    name: 'Camp',
    code: 'CAMP',
    decimals: 18,
    contractAddress: '0xE9E73E1aE76D17A16cC53E3e87a9a7dA78834d37',
    priceSource: {
      coinGeckoId: 'camp',
    },
  },
  ATRI: {
    name: 'Atari Token',
    code: 'ATRI',
    decimals: 0,
    contractAddress: '0xdacD69347dE42baBfAEcD09dC88958378780FB62',
    priceSource: {
      coinGeckoId: 'atari',
    },
  },
  GRT: {
    name: 'The Graph',
    code: 'GRT',
    decimals: 18,
    contractAddress: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
    color: '#1a41a9',
    priceSource: {
      coinGeckoId: 'the-graph',
    },
  },
  SUSHI: {
    name: 'Sushi',
    code: 'SUSHI',
    decimals: 18,
    contractAddress: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    color: '#1a41b9',
    priceSource: {
      coinGeckoId: 'sushi',
    },
  },
  '1INCH': {
    name: '1INCH',
    code: '1INCH',
    decimals: 18,
    contractAddress: '0x111111111117dc0aa78b770fa6a738034120c302',
    color: '#1a41c9',
    priceSource: {
      coinGeckoId: '1inch',
    },
  },
  USDK: {
    name: 'USDK',
    code: 'USDK',
    decimals: 18,
    contractAddress: '0x1c48f86ae57291f7686349f12601910bd8d470bb',
    color: '#1a41d9',
    priceSource: {
      coinGeckoId: 'usdk',
    },
  },
  CRV: {
    name: 'CRV',
    code: 'CRV',
    decimals: 18,
    contractAddress: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    color: '#1a41e9',
    priceSource: {
      coinGeckoId: 'curve-dao-token',
    },
  },
  ELON: {
    name: 'Dogelon MARS',
    code: 'ELON',
    decimals: 18,
    contractAddress: '0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3',
    color: '#1a41ee',
    priceSource: {
      coinGeckoId: 'dogelon-mars',
    },
  },
  OCEAN: {
    name: 'OCEAN Protocol',
    code: 'OCEAN',
    decimals: 18,
    contractAddress: '0x967da4048cd07ab37855c090aaf366e4ce1b9f48',
    color: '#1a413e',
    priceSource: {
      coinGeckoId: 'ocean-protocol',
    },
  },
  WOO: {
    name: 'Wootrade Network',
    code: 'WOO',
    decimals: 18,
    contractAddress: '0x4691937a7508860f876c9c0a2a617e7d9e945d4b',
    color: '#1aa13e',
    priceSource: {
      coinGeckoId: 'woo-network',
    },
  },
};

export default transformTokenMap(TOKENS, ChainId.Ethereum);
