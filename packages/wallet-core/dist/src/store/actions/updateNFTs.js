"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNFTs = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const __1 = require("..");
const updateNFTs = (context, { walletId, network, accountIds, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit, getters } = (0, __1.rootActionContext)(context);
    const nfts = yield bluebird_1.default.map(accountIds, (accountId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const account = getters.accountItem(accountId);
        const client = getters.client({
            network,
            walletId,
            chainId: account.chain,
            accountId: account.id,
        });
        if (!client.nft) {
            return [];
        }
        const nftAssetsStoredInState = account.nfts || [];
        const nftAssetsFetched = yield client.nft.fetch();
        const nfts = nftAssetsFetched.map((nftAsset) => {
            const nftAssetStoredInState = nftAssetsStoredInState.find((asset) => asset.token_id === nftAsset.token_id);
            const starred = nftAssetStoredInState ? nftAssetStoredInState.starred : false;
            if (!nftAsset.token_id && nftAsset.name) {
                const hash = nftAsset.name.match(/#(\d+)/);
                if (hash) {
                    nftAsset.token_id = hash[1];
                }
            }
            return Object.assign(Object.assign({}, nftAsset), { starred });
        });
        commit.UPDATE_NFTS({ network, walletId, accountId: account.id, nfts });
        return nfts;
    }), { concurrency: 3 });
    return nfts;
});
exports.updateNFTs = updateNFTs;
//# sourceMappingURL=updateNFTs.js.map