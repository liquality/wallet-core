"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleNFTStarred = void 0;
const __1 = require("..");
const toggleNFTStarred = (context, { network, walletId, accountId, nft }) => {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.NFT_TOGGLE_STARRED({ network, walletId, accountId, nft });
};
exports.toggleNFTStarred = toggleNFTStarred;
//# sourceMappingURL=toggleNFTStarred.js.map