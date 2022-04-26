import { setupWallet } from '../../index';
import defaultWalletOptions from '../../walletOptions/defaultOptions';
import { Network } from '../types';

describe.skip('updateBalances tests', () => {
    jest.setTimeout(60000);
    const wallet = setupWallet(defaultWalletOptions);
    beforeEach(async () => {
        await wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: 'inflict direct label mask release cargo also before ask future holiday device',
            imported: true,
        });
        await wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
    });

    it('should be able to validate updateBalances against testnet', async () => {
        // change network to testnet
        await wallet.dispatch.changeActiveNetwork({
            network: Network.Testnet,
        });
        expect(wallet.state.wallets.length).toBe(1);
        expect(wallet.state.activeNetwork).toBe('testnet');

        const walletId = wallet.state.activeWalletId;
        let testnetEnabledAssets = wallet?.state?.enabledAssets?.testnet?.[walletId];
        testnetEnabledAssets = testnetEnabledAssets!.filter((asset) => asset !== 'SOL');
        expect(testnetEnabledAssets?.length).not.toBe(0);

        // // initialize addresses for all assets
        // await wallet.dispatch.initializeAddresses({
        //     network: Network.Testnet,
        //     walletId: walletId,
        // });
        console.log(JSON.stringify(wallet.state));

        // update balance this will generate addresses for each asset
        await wallet.dispatch.updateBalances({
            network: Network.Testnet,
            walletId: walletId,
            assets: testnetEnabledAssets!,
        });
        console.log(JSON.stringify(wallet.state))

        // const account = wallet.state.accounts?.[walletId]?.testnet?.find((acc) => acc.chain === ChainId.Avalanche);
        // expect(account?.chain).toBe(ChainId.Avalanche);
        // const avaxAccountId = account?.id;
        // const avaxAddress = account?.addresses[0];
        // expect(avaxAddress).not.toBeNull();
        // expect(testnetEnabledAssets?.length).toBeGreaterThan(10);
        //
        // // update fiat rates for all assets
        // await wallet.dispatch.updateFiatRates({
        //     assets: testnetEnabledAssets!,
        // });
        //
        // // update asset fee for all assets
        // for (const testnetAsset of testnetEnabledAssets!) {
        //     await wallet.dispatch.updateFees({
        //         asset: testnetAsset!,
        //     });
        // }
        // // console.log(JSON.stringify(wallet.state));
        //
        // const maintainElement = wallet.state.fees.testnet?.[walletId];
        // // AVAX fee object checks
        // expect(maintainElement?.AVAX).toHaveProperty('fast');
        // const avaxFeeObject = maintainElement?.AVAX.fast;
    });
});
