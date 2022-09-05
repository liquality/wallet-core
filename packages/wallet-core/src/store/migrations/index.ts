import { cloneDeep } from 'lodash';
import { RootState } from '../types';
import { analitycsSettings } from './10_analytics_settings';
import { rskLegacyDerivationPath, rskLegacyDerivationPathFix } from './11_12_rsk_legacy_derivation_path';
import { rskFishToken } from './13_rsk_fish_token';
import { accountSetDerivationPath } from './14_account_set_derivation_path';
import { accountsChainsSetEnabled } from './15_accounts_chains_set_enabled';
import { enableTerraChain } from './16_enable_terra_chain';
import { removeInjectionEnabled } from './17_remove_injection_enabled';
import { enableAvalancheChain } from './18_enable_avalanche_chain';
import { removeExistingLedgerAccounts } from './19_remove_existing_ledger_accounts';
import { addMissingAccounts } from './20_fix_accounts';
import { enableSolanaChain } from './21_enable_solana_chain';
import { enableOptimismChain } from './22_enable_optimism_chain';

// Migrations
import { firstMigration } from './1_first_migration';
import { setDefaultAssets } from './2_set_default_assets';
import { addNetworkCustomTokens } from './3_add_network_custom_tokens';
import { fixRSKTokenInjectedAsset } from './4_fix_rsk_token_injected_asset';
import { multipleAccountSupport } from './5_multiple_account_support';
import { useLedgerLiveDefault } from './6_use_ledger_live_default';
import { multiProviderSwaps } from './7_multi_provider_swaps';
import { removeUseLedgerLive } from './8_remove_use_ledger_live';
import { injectEthereumAssetChain } from './9_inject_ethereum_asset_chain';

const migrations = [
  firstMigration, // v1
  setDefaultAssets, // v2
  addNetworkCustomTokens, // v3
  fixRSKTokenInjectedAsset, // v4
  multipleAccountSupport, // v5,
  useLedgerLiveDefault, // v6
  multiProviderSwaps, // v7
  removeUseLedgerLive, // v8
  injectEthereumAssetChain, // v9
  analitycsSettings, // v10
  rskLegacyDerivationPath, // v11
  rskLegacyDerivationPathFix, // v12
  rskFishToken, // v13
  accountSetDerivationPath, // v14
  accountsChainsSetEnabled, // v15
  enableTerraChain, // v16
  removeInjectionEnabled, // v17
  enableAvalancheChain, // v18
  removeExistingLedgerAccounts, // v19
  addMissingAccounts, // v20
  enableSolanaChain, // v21
  enableOptimismChain, // v22
];

const LATEST_VERSION = migrations[migrations.length - 1].version;

function isMigrationNeeded(state: RootState) {
  const currentVersion = state.version || 0;
  return currentVersion < LATEST_VERSION;
}

async function processMigrations(state: RootState) {
  const currentVersion = state.version || 0;

  let newState = cloneDeep(state);
  for (const migration of migrations) {
    if (currentVersion < migration.version) {
      try {
        newState = await migration.migrate(cloneDeep(newState));
        newState.version = migration.version;
      } catch (e) {
        console.error(`Failed to migrate to v${migration.version}`, e);
        break;
      }
    }
  }
  return newState;
}

export { LATEST_VERSION, isMigrationNeeded, processMigrations };
