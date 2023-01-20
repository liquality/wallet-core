require('dotenv').config()

const Web3 = require("web3");
const abiComplete = require("./abi/ISovryn.json");
const abiCompleteNew = require("./abi/ISovryn_new.json");
const abiLoanToken = require("./abi/abiLoanToken.json");
const abiLoanOpeningEvents = require("./abi/abiLoanOpeningEvents.json");
const abiERC20 = require("./abi/abiEERC20.json");
const abiGovernorAlpha = require("./abi/abiGovenorAlpha.json");
const abiSovrynSwapNetwork = require("./abi/abiSovrynSwapNetwork.json");
const abiLiquidityPool = require("./abi/abiLiquidityPoolV2Converter.json");
const abiLiquidityPoolV1 = require("./abi/abiLiquidityPoolV1Converter.json");
const abiVesting = require("./abi/VestingRegistry.json");
const abiStaking = require("./abi/abiStaking.json");
const abiWrapperProxy_new = require("./abi/abiWrapperProxy_new.json");
const abiWrapperProxy_old = require("./abi/abiRBTCWrapperProxy_old.json");
const abiPriceFeed = require("./abi/abiPriceFeed.json");
const abiLiquidityMining = require("./abi/mining_proxy.json");
const abiFeeSharingProxy = require("./abi/abiFeeSharingProxy.json");
const abiOracle = require("./abi/abiOracle.json");
const abiDevelopmentFund = require("./abi/abiDevelopmentFund.json");
const abiMultisig = require("./abi/abiMultisig.json");
const abiStakingReward = require("./abi/abiStakingReward.json");
const abiLockedSOV = require("./abi/LockedSOV.json");
const abiFeeHelper = require("./abi/FeesHelper.json");
const abiAffiliateFees = require("./abi/AffiliateFeeSharing.json");
const abiProtocolSettings = require("./abi/abiProtocolSettings.json");
const abiInterestUser = require("./abi/abiInterestUser.json");
const abiSwapsExternal = require("./abi/abiSwapsExternal.json")
const abiVestingLogic = require("./abi/VestingLogic.json")

const contractsTestnet = require("./contracts-testnet.json");
const contractsMainnet = require("./contracts-mainnet.json");

const addresses = process.env.NETWORK_MODE && process.env.NETWORK_MODE === "mainnet" ? contractsMainnet : contractsTestnet
const web3 = new Web3(process.env.WEB3_PROVIDER || "https://testnet2.sovryn.app/rpc");


module.exports = {
    /** FeesHelper,  */
    sovrynProtocol: new web3.eth.Contract(abiComplete.concat(abiAffiliateFees).concat(abiProtocolSettings).concat(abiInterestUser), addresses.Protocol.toLowerCase()),

    // Lending contracts
    DOC_lending: new web3.eth.Contract(abiLoanToken.concat(abiLoanOpeningEvents).concat(abiInterestUser), addresses.DOC_lending.toLowerCase()),
    BTC_lending: new web3.eth.Contract(abiLoanToken.concat(abiLoanOpeningEvents).concat(abiInterestUser), addresses.BTC_lending.toLowerCase()),
    USDT_lending: new web3.eth.Contract(abiLoanToken.concat(abiLoanOpeningEvents).concat(abiInterestUser), addresses.USDT_lending.toLowerCase()),
    BPRO_lending: new web3.eth.Contract(abiLoanToken.concat(abiLoanOpeningEvents).concat(abiInterestUser), addresses.BPRO_lending.toLowerCase()),
    XUSD_lending: new web3.eth.Contract(abiLoanToken.concat(abiLoanOpeningEvents).concat(abiInterestUser), addresses.XUSD_lending.toLowerCase()),

    //AMM contracts
    DOC_amm: new web3.eth.Contract(abiLiquidityPool, addresses.DOC_amm.toLowerCase()),
    USDT_amm: new web3.eth.Contract(abiLiquidityPool, addresses.USDT_amm.toLowerCase()),
    BPRO_amm: new web3.eth.Contract(abiLiquidityPool, addresses.BPRO_amm.toLowerCase()),
    SOV_amm: new web3.eth.Contract(abiLiquidityPoolV1, addresses.SOV_amm.toLowerCase()),
    ETH_amm: new web3.eth.Contract(abiLiquidityPoolV1, addresses.ETH_amm.toLowerCase()),
    MOC_amm: new web3.eth.Contract(abiLiquidityPoolV1, addresses.MOC_amm.toLowerCase()),
    XUSD_amm: new web3.eth.Contract(abiLiquidityPoolV1, addresses.XUSD_amm.toLowerCase()),
    BNBS_amm: new web3.eth.Contract(abiLiquidityPoolV1, addresses.BNBS_amm.toLowerCase()),
    FISH_amm: new web3.eth.Contract(abiLiquidityPoolV1, addresses.FISH_amm.toLowerCase()),
    MYNT_amm: new web3.eth.Contract(abiLiquidityPoolV1, addresses.MYNT_amm.toLowerCase()),
    RIF_amm: new web3.eth.Contract(abiLiquidityPoolV1, addresses.RIF_amm.toLowerCase()),

    //ERC20 tokens
    DOC_token: new web3.eth.Contract(abiERC20, addresses.DOC_token.toLowerCase()),
    USDT_token: new web3.eth.Contract(abiERC20, addresses.USDT_token.toLowerCase()),
    BTC_token: new web3.eth.Contract(abiERC20, addresses.BTC_token.toLowerCase()),
    BPRO_token: new web3.eth.Contract(abiERC20, addresses.BPRO_token.toLowerCase()),
    SOV_token: new web3.eth.Contract(abiERC20, addresses.SOV_token.toLowerCase()),
    ETH_token: new web3.eth.Contract(abiERC20, addresses.ETH_token.toLowerCase()),
    MOC_token: new web3.eth.Contract(abiERC20, addresses.MOC_token.toLowerCase()),
    XUSD_token: new web3.eth.Contract(abiERC20, addresses.XUSD_token.toLowerCase()),
    BNBS_token: new web3.eth.Contract(abiERC20, addresses.BNBS_token.toLowerCase()),
    FISH_token: new web3.eth.Contract(abiERC20, addresses.FISH_token.toLowerCase()),
    MYNT_token: new web3.eth.Contract(abiERC20, addresses.MYNT_token.toLowerCase()),
    RIF_token: new web3.eth.Contract(abiERC20, addresses.RIF_token.toLowerCase()),

    NTSov_token: new web3.eth.Contract(abiERC20, addresses.NTSOVToken.toLowerCase()),

    //ERC20 pool tokens
    DOC_pool: new web3.eth.Contract(abiERC20, addresses.DOC_pool.toLowerCase()),
    BTC_DOC_pool: new web3.eth.Contract(abiERC20, addresses.BTC_DOC_pool.toLowerCase()),
    USDT_pool: new web3.eth.Contract(abiERC20, addresses.USDT_pool.toLowerCase()),
    BTC_USDT_pool: new web3.eth.Contract(abiERC20, addresses.BTC_USDT_pool.toLowerCase()),
    BPRO_pool: new web3.eth.Contract(abiERC20, addresses.BPRO_pool.toLowerCase()),
    BTC_BPRO_pool: new web3.eth.Contract(abiERC20, addresses.BTC_BPRO_pool.toLowerCase()),
    SOV_pool: new web3.eth.Contract(abiERC20, addresses.SOV_pool.toLowerCase()),
    ETH_pool: new web3.eth.Contract(abiERC20, addresses.ETH_pool.toLowerCase()),
    MOC_pool: new web3.eth.Contract(abiERC20, addresses.MOC_pool.toLowerCase()),
    XUSD_pool: new web3.eth.Contract(abiERC20, addresses.XUSD_pool.toLowerCase()),
    BNBS_pool: new web3.eth.Contract(abiERC20, addresses.BNBS_pool.toLowerCase()),
    FISH_pool: new web3.eth.Contract(abiERC20, addresses.FISH_pool.toLowerCase()),
    MYNT_pool: new web3.eth.Contract(abiERC20, addresses.MYNT_pool.toLowerCase()),
    RIF_pool: new web3.eth.Contract(abiERC20, addresses.RIF_pool.toLowerCase()),

    //Treasury contracts
    Governor_Alpha: new web3.eth.Contract(abiGovernorAlpha, addresses.governorAlpha.toLowerCase()),
    Governor_Owner: new web3.eth.Contract(abiGovernorAlpha, addresses.governorOwner.toLowerCase()),
    Governor_Admin: new web3.eth.Contract(abiGovernorAlpha, addresses.governorAdmin.toLowerCase()),

    //Proxy contracts
    BTC_proxy_new: new web3.eth.Contract(abiWrapperProxy_new, addresses.proxy3.toLowerCase()),
    BTC_proxy_old: new web3.eth.Contract(abiWrapperProxy_old, addresses.btcWrapperProxy_new.toLowerCase()),
    FeeSharingProxy: new web3.eth.Contract(abiFeeSharingProxy, addresses.feeSharingProxy.toLowerCase()),

    //Swaps and prices
    swapNetwork: new web3.eth.Contract(abiSovrynSwapNetwork, addresses.swapNetwork.toLowerCase()),
    priceFeed: new web3.eth.Contract(abiPriceFeed, addresses.priceFeed.toLowerCase()),

    //Oracles
    SOV_oracle: new web3.eth.Contract(abiOracle, addresses.SOV_oracle.toLowerCase()),
    XUSD_oracle: new web3.eth.Contract(abiOracle, addresses.XUSD_oracle.toLowerCase()),
    ETHS_oracle: new web3.eth.Contract(abiOracle, addresses.ETHS_oracle.toLowerCase()),
    ETH_oracle: new web3.eth.Contract(abiOracle, addresses.ETH_oracle.toLowerCase()),
    MOC_oracle: new web3.eth.Contract(abiOracle, addresses.MOC_oracle.toLowerCase()),
    BNBS_oracle: new web3.eth.Contract(abiOracle, addresses.BNBS_oracle.toLowerCase()),
    FISH_oracle: new web3.eth.Contract(abiOracle, addresses.FISH_oracle.toLowerCase()),
    MYNT_oracle: new web3.eth.Contract(abiOracle, addresses.MYNT_oracle.toLowerCase()),

    //Vesting / staking / mining
    vesting1: new web3.eth.Contract(abiVesting, addresses.vestingRegistry1.toLowerCase()),
    vesting2: new web3.eth.Contract(abiVesting, addresses.vestingRegistry2.toLowerCase()),
    vesting3: new web3.eth.Contract(abiVesting, addresses.vestingRegistry3.toLowerCase()),
    vestingProxy: new web3.eth.Contract(abiVestingLogic, addresses.vestingRegistryProxy.toLowerCase()),
    staking: new web3.eth.Contract(abiStaking, addresses.staking.toLowerCase()),
    liquidityMining: new web3.eth.Contract(abiLiquidityMining, addresses.liquidityMiningProxy.toLowerCase()),
    lockedSOV: new web3.eth.Contract(abiLockedSOV, addresses.lockedSOV.toLowerCase()),

    multisig: new web3.eth.Contract(abiMultisig, addresses.multisig.toLowerCase()),

    stakingReward: new web3.eth.Contract(abiStakingReward, addresses.stakingReward.toLowerCase()),

    //RIF token
    RIF_amm: new web3.eth.Contract(abiLiquidityPoolV1, addresses.RIF_amm.toLowerCase()),
    RIF_oracle: new web3.eth.Contract(abiOracle, addresses.RIF_oracle.toLowerCase()),
    RIF_token: new web3.eth.Contract(abiERC20, addresses.RIF_token.toLowerCase())
}

if (process.env.NETWORK_MODE && process.env.NETWORK_MODE === "mainnet") {
    /** IF MAINNET */
    module.exports.AdoptionFund = new web3.eth.Contract(abiDevelopmentFund, addresses.AdoptionFund.toLowerCase());
    module.exports.Development_Fund = new web3.eth.Contract(abiDevelopmentFund, addresses.DevelopmentFund.toLowerCase());
} else {
    module.exports.sovrynProtocol = new web3.eth.Contract(abiCompleteNew.concat(abiSwapsExternal).concat(abiAffiliateFees).concat(abiProtocolSettings).concat(abiInterestUser), addresses.Protocol.toLowerCase())
}