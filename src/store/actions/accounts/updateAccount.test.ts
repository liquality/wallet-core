import {setupWallet} from "../../../index";
import defaultWalletOptions from "../../../walletOptions/defaultOptions";
import {Network} from "../../types";
import {ChainId} from "@liquality/cryptoassets";

let wallet: any;
describe('should be able to Update accounts', () => {
    beforeEach(async () => {
        jest.useFakeTimers()
        wallet = await setupWallet(defaultWalletOptions);
        await wallet.dispatch.setupWallet({
            key: '0x1234567890123456789012345678901234567890',
        });
        await wallet.dispatch.createWallet({
            key: '0x1234567890123456789012345678901234567890',
            mnemonic: 'rough symbol license spirit advance pact catalog vibrant dream great usage empty',
            imported: true,
        });
        await wallet.dispatch.unlockWallet({
            key: '0x1234567890123456789012345678901234567890',
        });

        await wallet.dispatch.setWatsNewModalShowed({
            version: "1.0.0",
        });
    })

    test('update a account', async () => {
        const walletId = wallet.state.activeWalletId;

        const account = wallet.state.accounts?.[walletId]?.mainnet?.[1];
        expect(account?.chain).toBe(ChainId.Ethereum);
        const ethAccountId = account?.id;
        const derivationPath="m/41'/60'/0'/0/0"

        const accountDetails = {
            id: ethAccountId,
            walletId: walletId,
            createdAt: Date.now(),
            enabled: true,
            derivationPath: derivationPath,
        }

        await wallet.dispatch.updateAccount({
            walletId: walletId,
            network: Network.Mainnet,
            account: accountDetails,
        });
        expect(wallet.state.accounts?.[walletId]?.mainnet?.[1]?.enabled).toBe(true);
        //TODO: check if the derivation path is updated
        expect(wallet.state.accounts?.[walletId]?.mainnet?.[1]?.derivationPath).toEqual(derivationPath);
    })
})
