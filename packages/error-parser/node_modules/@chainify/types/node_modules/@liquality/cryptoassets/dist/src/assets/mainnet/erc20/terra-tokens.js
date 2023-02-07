"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const utils_1 = require("../../utils");
const TOKENS = {
    ABR: {
        name: 'ABR',
        code: 'ABR',
        decimals: 6,
        contractAddress: 'terra1a7ye2splpfzyenu0yrdu8t83uzgusx2malkc7u',
        priceSource: {
            coinGeckoId: 'allbridge',
        },
    },
    bLuna: {
        name: 'bLuna',
        code: 'bLuna',
        decimals: 6,
        contractAddress: 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp',
    },
    bETH: {
        name: 'bETH',
        code: 'bETH',
        decimals: 6,
        contractAddress: 'terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun',
    },
    aUST: {
        name: 'aUST',
        code: 'aUST',
        decimals: 6,
        contractAddress: 'terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu',
    },
    ANC: {
        name: 'ANC',
        code: 'ANC',
        decimals: 6,
        contractAddress: 'terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76',
        priceSource: {
            coinGeckoId: 'anchor-protocol',
        },
    },
    HALO: {
        name: 'HALO',
        code: 'HALO',
        decimals: 6,
        contractAddress: 'terra1w8kvd6cqpsthupsk4l0clwnmek4l3zr7c84kwq',
    },
    APOLLO: {
        name: 'APOLLO',
        code: 'APOLLO',
        decimals: 6,
        contractAddress: 'terra100yeqvww74h4yaejj6h733thgcafdaukjtw397',
        priceSource: {
            coinGeckoId: 'apollo-dao',
        },
    },
    ASTRO: {
        name: 'ASTRO',
        code: 'ASTRO',
        decimals: 6,
        contractAddress: 'terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3',
        priceSource: {
            coinGeckoId: 'astroport',
        },
    },
    PUG: {
        name: 'PUG',
        code: 'PUG',
        decimals: 6,
        contractAddress: 'terra1kdfsdm3c4reun9j3m4mk3nmyw4a4ns7mj24q3j',
    },
    BTL: {
        name: 'BTL',
        code: 'BTL',
        decimals: 6,
        contractAddress: 'terra193c42lfwmlkasvcw22l9qqzc5q2dx208tkd7wl',
        priceSource: {
            coinGeckoId: 'bitlocus',
        },
    },
    SITY: {
        name: 'SITY',
        code: 'SITY',
        decimals: 6,
        contractAddress: 'terra1z09gnzufuflz6ckd9k0u456l9dnpgsynu0yyhe',
    },
    MIR: {
        name: 'Mirror',
        code: 'MIR',
        decimals: 6,
        contractAddress: 'terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6',
        priceSource: {
            coinGeckoId: 'mirror-protocol',
        },
    },
    mAAPL: {
        name: 'Apple Inc.',
        code: 'mAAPL',
        decimals: 6,
        contractAddress: 'terra1vxtwu4ehgzz77mnfwrntyrmgl64qjs75mpwqaz',
        priceSource: {
            coinGeckoId: 'mirrored-apple',
        },
    },
    mABNB: {
        name: 'Airbnb Inc.',
        code: 'mABNB',
        decimals: 6,
        contractAddress: 'terra1g4x2pzmkc9z3mseewxf758rllg08z3797xly0n',
        priceSource: {
            coinGeckoId: 'mirrored-airbnb',
        },
    },
    mAMC: {
        name: 'AMC Entertainment Holdings Inc.',
        code: 'mAMC',
        decimals: 6,
        contractAddress: 'terra1qelfthdanju7wavc5tq0k5r0rhsyzyyrsn09qy',
        priceSource: {
            coinGeckoId: 'mirrored-amc-entertainment',
        },
    },
    mAMD: {
        name: 'Advanced Micro Devices, Inc.',
        code: 'mAMD',
        decimals: 6,
        contractAddress: 'terra18ej5nsuu867fkx4tuy2aglpvqjrkcrjjslap3z',
    },
    mAMZN: {
        name: 'Amazon.com, Inc.',
        code: 'mAMZN',
        decimals: 6,
        contractAddress: 'terra165nd2qmrtszehcfrntlplzern7zl4ahtlhd5t2',
        priceSource: {
            coinGeckoId: 'mirrored-amzn',
        },
    },
    mARKK: {
        name: 'ARK Innovation ETF',
        code: 'mARKK',
        decimals: 6,
        contractAddress: 'terra1qqfx5jph0rsmkur2zgzyqnfucra45rtjae5vh6',
    },
    mBABA: {
        name: 'Alibaba Group Holding Limited',
        code: 'mBABA',
        decimals: 6,
        contractAddress: 'terra1w7zgkcyt7y4zpct9dw8mw362ywvdlydnum2awa',
    },
    mBTC: {
        name: 'Bitcoin',
        code: 'mBTC',
        decimals: 6,
        contractAddress: 'terra1rhhvx8nzfrx5fufkuft06q5marfkucdqwq5sjw',
    },
    mCOIN: {
        name: 'Coinbase Global, Inc',
        code: 'mCOIN',
        decimals: 6,
        contractAddress: 'terra18wayjpyq28gd970qzgjfmsjj7dmgdk039duhph',
    },
    mDOT: {
        name: 'Polkadot',
        code: 'mDOT',
        decimals: 6,
        contractAddress: 'terra19ya4jpvjvvtggepvmmj6ftmwly3p7way0tt08r',
    },
    mETH: {
        name: 'Ether',
        code: 'mETH',
        decimals: 6,
        contractAddress: 'terra1dk3g53js3034x4v5c3vavhj2738une880yu6kx',
    },
    mFB: {
        name: 'Facebook Inc.',
        code: 'mFB',
        decimals: 6,
        contractAddress: 'terra1mqsjugsugfprn3cvgxsrr8akkvdxv2pzc74us7',
    },
    mGLXY: {
        name: 'Galaxy Digital Holdings Ltd',
        code: 'mGLXY',
        decimals: 6,
        contractAddress: 'terra1l5lrxtwd98ylfy09fn866au6dp76gu8ywnudls',
    },
    mGME: {
        name: 'GameStop Corp',
        code: 'mGME',
        decimals: 6,
        contractAddress: 'terra1m6j6j9gw728n82k78s0j9kq8l5p6ne0xcc820p',
    },
    mGOOGL: {
        name: 'Alphabet Inc.',
        code: 'mGOOGL',
        decimals: 6,
        contractAddress: 'terra1h8arz2k547uvmpxctuwush3jzc8fun4s96qgwt',
        priceSource: {
            coinGeckoId: 'mirrored-googl',
        },
    },
    mGS: {
        name: 'Goldman Sachs Group Inc.',
        code: 'mGS',
        decimals: 6,
        contractAddress: 'terra137drsu8gce5thf6jr5mxlfghw36rpljt3zj73v',
    },
    mIAU: {
        name: 'iShares Gold Trust',
        code: 'mIAU',
        decimals: 6,
        contractAddress: 'terra10h7ry7apm55h4ez502dqdv9gr53juu85nkd4aq',
    },
    MOON: {
        name: 'MOON',
        code: 'MOON',
        decimals: 6,
        contractAddress: 'terra1hmxxq0y8h79f3228vs0czc4uz5jdgjt0appp26',
    },
    mMSFT: {
        name: 'Microsoft Corporation',
        code: 'mMSFT',
        decimals: 6,
        contractAddress: 'terra1227ppwxxj3jxz8cfgq00jgnxqcny7ryenvkwj6',
    },
    mNFLX: {
        name: 'Netflix, Inc.',
        code: 'mNFLX',
        decimals: 6,
        contractAddress: 'terra1jsxngqasf2zynj5kyh0tgq9mj3zksa5gk35j4k',
    },
    mQQQ: {
        name: 'Invesco QQQ Trust',
        code: 'mQQQ',
        decimals: 6,
        contractAddress: 'terra1csk6tc7pdmpr782w527hwhez6gfv632tyf72cp',
    },
    mSLV: {
        name: 'iShares Silver Trust',
        code: 'mSLV',
        decimals: 6,
        contractAddress: 'terra1kscs6uhrqwy6rx5kuw5lwpuqvm3t6j2d6uf2lp',
    },
    mSPY: {
        name: 'SPDR S&P 500',
        code: 'mSPY',
        decimals: 6,
        contractAddress: 'terra1aa00lpfexyycedfg5k2p60l9djcmw0ue5l8fhc',
    },
    mSQ: {
        name: 'Square, Inc.',
        code: 'mSQ',
        decimals: 6,
        contractAddress: 'terra1u43zu5amjlsgty5j64445fr9yglhm53m576ugh',
    },
    mTSLA: {
        name: 'Tesla, Inc.',
        code: 'mTSLA',
        decimals: 6,
        contractAddress: 'terra14y5affaarufk3uscy2vr6pe6w6zqf2wpjzn5sh',
    },
    mTWTR: {
        name: 'Twitter, Inc.',
        code: 'mTWTR',
        decimals: 6,
        contractAddress: 'terra1cc3enj9qgchlrj34cnzhwuclc4vl2z3jl7tkqg',
    },
    mUSO: {
        name: 'United States Oil Fund, LP',
        code: 'mUSO',
        decimals: 6,
        contractAddress: 'terra1lvmx8fsagy70tv0fhmfzdw9h6s3sy4prz38ugf',
    },
    mVIXY: {
        name: 'ProShares VIX Short-Term Futures ETF',
        code: 'mVIXY',
        decimals: 6,
        contractAddress: 'terra19cmt6vzvhnnnfsmccaaxzy2uaj06zjktu6yzjx',
    },
    LOTA: {
        name: 'LOTA',
        code: 'LOTA',
        decimals: 6,
        contractAddress: 'terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr',
        priceSource: {
            coinGeckoId: 'loterra',
        },
    },
    LUNI: {
        name: 'LUNI',
        code: 'LUNI',
        decimals: 6,
        contractAddress: 'terra1m3tdguf59xq3pa2twk5fjte5g6szj5y9x5npy7',
        priceSource: {
            coinGeckoId: 'loterra',
        },
    },
    DPH: {
        name: 'Digipharm',
        code: 'DPH',
        decimals: 6,
        contractAddress: 'terra17jnhankdfl8vyzj6vejt7ag8uz0cjc9crkl2h7',
        priceSource: {
            coinGeckoId: 'digipharm',
        },
    },
    MARS: {
        name: 'MARS',
        code: 'MARS',
        decimals: 6,
        contractAddress: 'terra1a7zxk56c72elupp7p44hn4k94fsvavnhylhr6h',
    },
    GLOW: {
        name: 'GLOW',
        code: 'GLOW',
        decimals: 6,
        contractAddress: 'terra13zx49nk8wjavedjzu8xkk95r3t0ta43c9ptul7',
        priceSource: {
            coinGeckoId: 'glow-token',
        },
    },
    KUJI: {
        name: 'KUJI',
        code: 'KUJI',
        decimals: 6,
        contractAddress: 'terra1xfsdgcemqwxp4hhnyk4rle6wr22sseq7j07dnn',
        priceSource: {
            coinGeckoId: 'kujira',
        },
    },
    stLuna: {
        name: 'stLuna',
        code: 'stLuna',
        decimals: 6,
        contractAddress: 'terra1yg3j2s986nyp5z7r2lvt0hx3r0lnd7kwvwwtsc',
    },
    'pylon-protocol': {
        name: 'Pylon MINE Token',
        code: 'pylon-protocol',
        decimals: 6,
        contractAddress: 'terra1kcthelkax4j9x8d3ny6sdag0qmxxynl3qtcrpy',
        priceSource: {
            coinGeckoId: 'mirrored-amd',
        },
    },
    SPEC: {
        name: 'Spectrum',
        code: 'SPEC',
        decimals: 6,
        contractAddress: 'terra1s5eczhe0h0jutf46re52x5z4r03c8hupacxmdr',
        priceSource: {
            coinGeckoId: 'mirrored-amd',
        },
    },
    LOOP: {
        name: 'LOOP',
        code: 'LOOP',
        decimals: 6,
        contractAddress: 'terra1nef5jf6c7js9x6gkntlehgywvjlpytm7pcgkn4',
        priceSource: {
            coinGeckoId: 'mirrored-amd',
        },
    },
    LOOPR: {
        name: 'LOOPR',
        code: 'LOOPR',
        decimals: 6,
        contractAddress: 'terra1jx4lmmke2srcvpjeereetc9hgegp4g5j0p9r2q',
        priceSource: {
            coinGeckoId: 'mirrored-amd',
        },
    },
    aLOT: {
        name: 'aLOT',
        code: 'aLOT',
        decimals: 0,
        contractAddress: 'terra1366wmr8t8rrkh6mag8fagqxntmf2qe4kyte784',
    },
    STT: {
        name: 'StarTerra',
        code: 'STT',
        decimals: 6,
        contractAddress: 'terra13xujxcrc9dqft4p9a8ls0w3j0xnzm6y2uvve8n',
        priceSource: {
            coinGeckoId: 'mirrored-amd',
        },
    },
    TWD: {
        name: 'TerraWorld',
        code: 'TWD',
        decimals: 6,
        contractAddress: 'terra19djkaepjjswucys4npd5ltaxgsntl7jf0xz7w6',
        priceSource: {
            coinGeckoId: 'mirrored-amd',
        },
    },
    MIAW: {
        name: 'MIAW',
        code: 'MIAW',
        decimals: 6,
        contractAddress: 'terra1vtr50tw0pgqpes34zqu60n554p9x4950wk8f63',
        priceSource: {
            coinGeckoId: 'mirrored-amd',
        },
    },
    Psi: {
        name: 'Nexus Governance',
        code: 'Psi',
        decimals: 6,
        contractAddress: 'terra12897djskt9rge8dtmm86w654g7kzckkd698608',
        priceSource: {
            coinGeckoId: 'mirrored-amd',
        },
    },
    VKR: {
        name: 'VKR',
        code: 'VKR',
        decimals: 6,
        contractAddress: 'terra1dy9kmlm4anr92e42mrkjwzyvfqwz66un00rwr5',
        priceSource: {
            coinGeckoId: 'mirrored-amd',
        },
    },
    ORION: {
        name: 'ORION',
        code: 'ORION',
        decimals: 8,
        contractAddress: 'terra1mddcdx0ujx89f38gu7zspk2r2ffdl5enyz2u03',
        priceSource: {
            coinGeckoId: 'orion-money',
        },
    },
    ORNE: {
        name: 'ORNE',
        code: 'ORNE',
        decimals: 6,
        contractAddress: 'terra1hnezwjqlhzawcrfysczcxs6xqxu2jawn729kkf',
        priceSource: {
            coinGeckoId: 'orne',
        },
    },
    PLY: {
        name: 'PLY',
        code: 'PLY',
        decimals: 6,
        contractAddress: 'terra1hnezwjqlhzawcrfysczcxs6xqxu2jawn729kkf',
        priceSource: {
            coinGeckoId: 'playnity',
        },
    },
    PRISM: {
        name: 'PRISM',
        code: 'PRISM',
        decimals: 6,
        contractAddress: 'terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw',
        priceSource: {
            coinGeckoId: 'prism-protocol',
        },
    },
    xPRISM: {
        name: 'xPRISM',
        code: 'xPRISM',
        decimals: 6,
        contractAddress: 'terra1042wzrwg2uk6jqxjm34ysqquyr9esdgm5qyswz',
    },
    'bPsiDP-24m': {
        name: 'bPsiDP-24m',
        code: 'bPsiDP-24m',
        decimals: 6,
        contractAddress: 'terra1zsaswh926ey8qa5x4vj93kzzlfnef0pstuca0y',
    },
    SDOLLAR: {
        name: 'SDOLLAR',
        code: 'SDOLLAR',
        decimals: 2,
        contractAddress: 'terra1l0y8yg0s86x299nqw0p6fhh7ngex3r4phtjeuq',
        priceSource: {
            coinGeckoId: 'space-dollars',
        },
    },
    LunaX: {
        name: 'LunaX',
        code: 'LunaX',
        decimals: 6,
        contractAddress: 'terra17y9qkl8dfkeg4py7n0g5407emqnemc3yqk5rup',
        priceSource: {
            coinGeckoId: 'stader-lunax',
        },
    },
    TFLOKI: {
        name: 'TFLOKI',
        code: 'TFLOKI',
        decimals: 6,
        contractAddress: 'terra1u2k0nkenw0p25ljsr4ksh7rxm65y466vkdewwj',
        priceSource: {
            coinGeckoId: 'terrafloki',
        },
    },
    TFTIC: {
        name: 'TFTIC',
        code: 'TFTIC',
        decimals: 6,
        contractAddress: 'terra1a8k3jyv3wf6k3zngza5h6srrxcckdf7zv90p6u',
    },
    TFTICII: {
        name: 'TFTICII',
        code: 'TFTICII',
        decimals: 6,
        contractAddress: 'terra1xt9fgu7965kgvunnjts9zkprd8986kcc444q86',
    },
    TFTICIII: {
        name: 'TFTICIII',
        code: 'TFTICIII',
        decimals: 6,
        contractAddress: 'terra1vte2xv7dr8sfnrnwdf9arcyprqgr0hty5ads28',
    },
    TLAND: {
        name: 'TLAND',
        code: 'TLAND',
        decimals: 6,
        contractAddress: 'terra1r5506ckw5tfr3z52jwlek8vg9sn3yflrqrzfsc',
        priceSource: {
            coinGeckoId: 'terraland-token',
        },
    },
    XRUNE: {
        name: 'XRUNE',
        code: 'XRUNE',
        decimals: 6,
        contractAddress: 'terra1td743l5k5cmfy7tqq202g7vkmdvq35q48u2jfm',
        priceSource: {
            coinGeckoId: 'thorstarter',
        },
    },
    WHALE: {
        name: 'WHALE',
        code: 'WHALE',
        decimals: 6,
        contractAddress: 'terra1php5m8a6qd68z02t3zpw4jv2pj4vgw4wz0t8mz',
        priceSource: {
            coinGeckoId: 'white-whale',
        },
    },
    weWETH: {
        name: 'weWETH',
        code: 'weWETH',
        decimals: 8,
        contractAddress: 'terra14tl83xcwqjy0ken9peu4pjjuu755lrry2uy25r',
        priceSource: {
            coinGeckoId: 'ethereum',
        },
    },
    weWBTC: {
        name: 'weWBTC',
        code: 'weWBTC',
        decimals: 8,
        contractAddress: 'terra1aa7upykmmqqc63l924l5qfap8mrmx5rfdm0v55',
        priceSource: {
            coinGeckoId: 'bitcoin',
        },
    },
    wsSOL: {
        name: 'wsSOL',
        code: 'wsSOL',
        decimals: 8,
        contractAddress: 'terra190tqwgqx7s8qrknz6kckct7v607cu068gfujpk',
        priceSource: {
            coinGeckoId: 'solana',
        },
    },
    weMATIC: {
        name: 'weMATIC',
        code: 'weMATIC',
        decimals: 8,
        contractAddress: 'terra1dfasranqm4uyaz72r960umxy0w8t6zewqlnkuq',
        priceSource: {
            coinGeckoId: 'matic-network',
        },
    },
    wbWBNB: {
        name: 'wbWBNB',
        code: 'wbWBNB',
        decimals: 8,
        contractAddress: 'terra1cetg5wruw2wsdjp7j46rj44xdel00z006e9yg8',
        priceSource: {
            coinGeckoId: 'binancecoin',
        },
    },
    wbCake: {
        name: 'wbCake',
        code: 'wbCake',
        decimals: 8,
        contractAddress: 'terra1xvqlpjl2dxyel9qrp6qvtrg04xe3jh9cyxc6av',
        priceSource: {
            coinGeckoId: 'pancakeswap-token',
        },
    },
    weLINK: {
        name: 'weLINK',
        code: 'weLINK',
        decimals: 8,
        contractAddress: 'terra12dfv3f0e6m22z6cnhfn3nxk2en3z3zeqy6ctym',
        priceSource: {
            coinGeckoId: 'chainlink',
        },
    },
    weSUSHI: {
        name: 'weSUSHI',
        code: 'weSUSHI',
        decimals: 8,
        contractAddress: 'terra1csvuzlf92nyemu6tv25h0l79etpe8hz3h5vn4a',
        priceSource: {
            coinGeckoId: 'sushi',
        },
    },
    weUNI: {
        name: 'weUNI',
        code: 'weUNI',
        decimals: 8,
        contractAddress: 'terra1wyxkuy5jq545fn7xfn3enpvs5zg9f9dghf6gxf',
        priceSource: {
            coinGeckoId: 'uniswap',
        },
    },
    weUSDT: {
        name: 'weUSDT',
        code: 'weUSDT',
        decimals: 8,
        contractAddress: 'terra1ce06wkrdm4vl6t0hvc0g86rsy27pu8yadg3dva',
        priceSource: {
            coinGeckoId: 'tether',
        },
    },
    weUSDC: {
        name: 'weUSDC',
        code: 'weUSDC',
        decimals: 8,
        contractAddress: 'terra1pepwcav40nvj3kh60qqgrk8k07ydmc00xyat06',
        priceSource: {
            coinGeckoId: 'usd-coin',
        },
    },
    wewstETH: {
        name: 'wewstETH',
        code: 'wewstETH',
        decimals: 8,
        contractAddress: 'terra133chr09wu8sakfte5v7vd8qzq9vghtkv4tn0ur',
        priceSource: {
            coinGeckoId: 'ethereum',
        },
    },
    wsstSOL: {
        name: 'wsstSOL',
        code: 'wsstSOL',
        decimals: 8,
        contractAddress: 'terra1t9ul45l7m6jw6sxgvnp8e5hj8xzkjsg82g84ap',
        priceSource: {
            coinGeckoId: 'solana',
        },
    },
    weLDO: {
        name: 'weLDO',
        code: 'weLDO',
        decimals: 8,
        contractAddress: 'terra1jxypgnfa07j6w92wazzyskhreq2ey2a5crgt6z',
    },
    webETH: {
        name: 'webETH',
        code: 'webETH',
        decimals: 8,
        contractAddress: 'terra1u5szg038ur9kzuular3cae8hq6q5rk5u27tuvz',
        priceSource: {
            coinGeckoId: 'ethereum',
        },
    },
    XDEFI: {
        name: 'XDEFI',
        code: 'XDEFI',
        decimals: 8,
        contractAddress: 'terra169edevav3pdrtjcx35j6pvzuv54aevewar4nlh',
        priceSource: {
            coinGeckoId: 'xdefi',
        },
    },
    whGTPS: {
        name: 'whGTPS',
        code: 'whGTPS',
        decimals: 8,
        contractAddress: 'terra1y3d5qexmyac0fg53pfglh2pjk0664ymfvcq9mc',
    },
    whSAIL: {
        name: 'whSAIL',
        code: 'whSAIL',
        decimals: 8,
        contractAddress: 'terra1ku5e0dhutxhuxudsmsn5647wwcz6ndr3rsh90k',
    },
    whgSAIL: {
        name: 'whgSAIL',
        code: 'whgSAIL',
        decimals: 8,
        contractAddress: 'terra1rl0cpwgtwl4utnaynugevdje37fnmsea7rv4uu',
    },
    nLUNA: {
        name: 'nLUNA',
        code: 'nLUNA',
        decimals: 6,
        contractAddress: 'terra10f2mt82kjnkxqj2gepgwl637u2w4ue2z5nhz5j',
    },
    nETH: {
        name: 'nETH',
        code: 'nETH',
        decimals: 6,
        contractAddress: 'terra178v546c407pdnx5rer3hu8s2c0fc924k74ymnn',
    },
    wgOHM: {
        name: 'wgOHM',
        code: 'wgOHM',
        decimals: 6,
        contractAddress: 'terra1fpfn2kkr8mv390wx4dtpfk3vkjx9ch3thvykl3',
    },
    wAVAX: {
        name: 'wAVAX',
        code: 'wAVAX',
        decimals: 6,
        contractAddress: 'terra1hj8de24c3yqvcsv9r8chr03fzwsak3hgd8gv3m',
    },
    wsoUSDC: {
        name: 'wsoUSDC',
        code: 'wsoUSDC',
        decimals: 6,
        contractAddress: 'terra1e6mq63y64zcxz8xyu5van4tgkhemj3r86yvgu4',
    },
    wavUSDC: {
        name: 'wavUSDC',
        code: 'wavUSDC',
        decimals: 6,
        contractAddress: 'terra1pvel56a2hs93yd429pzv9zp5aptcjg5ulhkz7w',
    },
    wBUSD: {
        name: 'wBUSD',
        code: 'wBUSD',
        decimals: 6,
        contractAddress: 'terra1skjr69exm6v8zellgjpaa2emhwutrk5a6dz7dd',
    },
};
exports.default = (0, utils_1.transformTokenMap)(TOKENS, types_1.ChainId.Terra);
//# sourceMappingURL=terra-tokens.js.map