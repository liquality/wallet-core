import {getNativeAsset, getTransactionExplorerLink, isERC20, isEthereumChain} from "./asset";
import {Network} from "../store/types";

describe("asset tests", () => {
  test('get native asset test', async () => {
    expect(getNativeAsset("DAI")).toBe("ETH");
    expect(getNativeAsset("MATIC")).toBe("MATIC");
    expect(getNativeAsset("UST")).toBe("UST");
    expect(getNativeAsset("LUNA")).toBe("LUNA");
    expect(getNativeAsset("SOV")).toBe("RBTC");
  });

  test('is ERC20 test', async () => {
    expect(isERC20("ETH")).toBe(false);
    expect(isERC20("DAI")).toBe(true);
    expect(isERC20("USDT")).toBe(true);
    expect(isERC20("NEAR")).toBe(false);
  });

  test('is isEthereumChain', async () => {
    expect(isEthereumChain("ETH")).toBe(true);
    expect(isERC20("DAI")).toBe(true);
    expect(isERC20("USDT")).toBe(true);
    expect(isERC20("WBTC")).toBe(true);
    expect(isERC20("NEAR")).toBe(false);
    expect(isERC20("LUNA")).toBe(false);
    expect(isERC20("BTC")).toBe(false);
  });

  test('getTransactionExplorerLink test', async () => {

    let result = getTransactionExplorerLink("f04298d08f77014851f1104a4d7a0248", "ETH", Network.Mainnet);
    expect(result).toContain("https://etherscan.io/tx/");

    result = getTransactionExplorerLink("f04298d08f77014851f1104a4d7a0248", "DAI", Network.Mainnet);
    expect(result).toContain("https://etherscan.io/tx/");

    result = getTransactionExplorerLink("f04298d08f77014851f1104a4d7a0248", "USDT", Network.Mainnet);
    expect(result).toContain("https://etherscan.io/tx/");

    result = getTransactionExplorerLink("f04298d08f77014851f1104a4d7a0248", "WBTC", Network.Mainnet);
    expect(result).toContain("https://etherscan.io/tx/");

    result = getTransactionExplorerLink("f04298d08f77014851f1104a4d7a0248", "NEAR", Network.Mainnet);
    expect(result).toContain("https://explorer.mainnet.near.org/transactions/");
  });
});
