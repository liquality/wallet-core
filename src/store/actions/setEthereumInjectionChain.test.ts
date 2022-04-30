import {setupWallet} from "../../index";
import defaultWalletOptions from "../../walletOptions/defaultOptions";
import {ChainId} from "@liquality/cryptoassets";

describe("setEthereumInjectionChain", () => {
  it("should return the correct action", async () => {
    const wallet = await setupWallet(defaultWalletOptions);
    await wallet.dispatch.createWallet({
      key: '0x1234567890123456789012345678901234567890',
      mnemonic: 'test',
      imported: true,
    });
    await wallet.dispatch.unlockWallet({
      key: '0x1234567890123456789012345678901234567890',
    });
    await wallet.dispatch.setEthereumInjectionChain({chain: ChainId.Rootstock});
    expect(wallet.state.injectEthereumChain).toEqual(ChainId.Rootstock);
  });
});
