import { Chain, Config, ConfigUpdate } from '../types';
export default class ConfigService {
    private static instance;
    private readonly config;
    private readonly setupPromise;
    private resolveSetupPromise;
    constructor();
    private static chainIdToObject;
    private static getDefaultConfig;
    static getInstance(): ConfigService;
    /**
     * This call immediately returns the current config. It does not make sure that all chain data is already loaded
     * Use this if you need access to basic information like API urls or settings
     */
    getConfig: () => Config;
    /**
     * This call waits for all setup promises to be done.
     * Use this if you need access to chain data (RPCs or multicalls)
     */
    getConfigAsync: () => Promise<Config>;
    updateConfig: (configUpdate: ConfigUpdate) => Config;
    updateChains: (chains: Chain[]) => Config;
}
