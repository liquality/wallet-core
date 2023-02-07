"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMigrations = exports.isMigrationNeeded = exports.LATEST_VERSION = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const _10_analytics_settings_1 = require("./10_analytics_settings");
const _11_12_rsk_legacy_derivation_path_1 = require("./11_12_rsk_legacy_derivation_path");
const _13_rsk_fish_token_1 = require("./13_rsk_fish_token");
const _14_account_set_derivation_path_1 = require("./14_account_set_derivation_path");
const _15_accounts_chains_set_enabled_1 = require("./15_accounts_chains_set_enabled");
const _16_enable_terra_chain_1 = require("./16_enable_terra_chain");
const _17_remove_injection_enabled_1 = require("./17_remove_injection_enabled");
const _18_enable_avalanche_chain_1 = require("./18_enable_avalanche_chain");
const _19_remove_existing_ledger_accounts_1 = require("./19_remove_existing_ledger_accounts");
const _20_fix_accounts_1 = require("./20_fix_accounts");
const _21_enable_solana_chain_1 = require("./21_enable_solana_chain");
const _22_enable_optimism_chain_1 = require("./22_enable_optimism_chain");
const _1_first_migration_1 = require("./1_first_migration");
const _2_set_default_assets_1 = require("./2_set_default_assets");
const _3_add_network_custom_tokens_1 = require("./3_add_network_custom_tokens");
const _4_fix_rsk_token_injected_asset_1 = require("./4_fix_rsk_token_injected_asset");
const _5_multiple_account_support_1 = require("./5_multiple_account_support");
const _6_use_ledger_live_default_1 = require("./6_use_ledger_live_default");
const _7_multi_provider_swaps_1 = require("./7_multi_provider_swaps");
const _8_remove_use_ledger_live_1 = require("./8_remove_use_ledger_live");
const _9_inject_ethereum_asset_chain_1 = require("./9_inject_ethereum_asset_chain");
const migrations = [
    _1_first_migration_1.firstMigration,
    _2_set_default_assets_1.setDefaultAssets,
    _3_add_network_custom_tokens_1.addNetworkCustomTokens,
    _4_fix_rsk_token_injected_asset_1.fixRSKTokenInjectedAsset,
    _5_multiple_account_support_1.multipleAccountSupport,
    _6_use_ledger_live_default_1.useLedgerLiveDefault,
    _7_multi_provider_swaps_1.multiProviderSwaps,
    _8_remove_use_ledger_live_1.removeUseLedgerLive,
    _9_inject_ethereum_asset_chain_1.injectEthereumAssetChain,
    _10_analytics_settings_1.analitycsSettings,
    _11_12_rsk_legacy_derivation_path_1.rskLegacyDerivationPath,
    _11_12_rsk_legacy_derivation_path_1.rskLegacyDerivationPathFix,
    _13_rsk_fish_token_1.rskFishToken,
    _14_account_set_derivation_path_1.accountSetDerivationPath,
    _15_accounts_chains_set_enabled_1.accountsChainsSetEnabled,
    _16_enable_terra_chain_1.enableTerraChain,
    _17_remove_injection_enabled_1.removeInjectionEnabled,
    _18_enable_avalanche_chain_1.enableAvalancheChain,
    _19_remove_existing_ledger_accounts_1.removeExistingLedgerAccounts,
    _20_fix_accounts_1.addMissingAccounts,
    _21_enable_solana_chain_1.enableSolanaChain,
    _22_enable_optimism_chain_1.enableOptimismChain,
];
const LATEST_VERSION = migrations[migrations.length - 1].version;
exports.LATEST_VERSION = LATEST_VERSION;
function isMigrationNeeded(state) {
    const currentVersion = state.version || 0;
    return currentVersion < LATEST_VERSION;
}
exports.isMigrationNeeded = isMigrationNeeded;
function processMigrations(state) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const currentVersion = state.version || 0;
        let newState = (0, lodash_1.cloneDeep)(state);
        for (const migration of migrations) {
            if (currentVersion < migration.version) {
                try {
                    newState = yield migration.migrate((0, lodash_1.cloneDeep)(newState));
                    newState.version = migration.version;
                }
                catch (e) {
                    console.error(`Failed to migrate to v${migration.version}`, e);
                    break;
                }
            }
        }
        return newState;
    });
}
exports.processMigrations = processMigrations;
//# sourceMappingURL=index.js.map