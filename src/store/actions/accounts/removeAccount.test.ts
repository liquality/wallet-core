import {setupWallet} from "../../../index";
import defaultWalletOptions from "../../../walletOptions/defaultOptions";
import {Network} from "../../types";

let wallet: any;

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
test('should be able to remove account', async () => {
    const walletId = wallet.state.activeWalletId;
    const btcMainnetAccountId = wallet.state.accounts?.[walletId].mainnet[0].id;
    const ethMainnetAccountId = wallet.state.accounts?.[walletId].mainnet[1].id;
    const btcTestnetAccountId = wallet.state.accounts?.[walletId].testnet[0].id;
    const ethTestnetAccountId = wallet.state.accounts?.[walletId].testnet[1].id;

    //remove btc mainnet account
    await wallet.dispatch.removeAccount({
        network: Network.Mainnet,
        walletId: walletId,
        id: btcMainnetAccountId,
    });

    await wallet.dispatch.removeAccount({
        network: Network.Mainnet,
        walletId: walletId,
        id: ethMainnetAccountId,
    });

    await wallet.dispatch.removeAccount({
        network: Network.Testnet,
        walletId: walletId,
        id: ethTestnetAccountId,
    });
    await wallet.dispatch.removeAccount({
        network: Network.Testnet,
        walletId: walletId,
        id: btcTestnetAccountId,
    });
    console.log(JSON.stringify(wallet.state))
    //TODO: check if account is removed
});
