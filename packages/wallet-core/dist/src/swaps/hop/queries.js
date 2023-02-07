"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDestinationTxGQL = exports.getTransferIdByTxHash = void 0;
function getDestinationTxHashFromL1Source(recipient) {
    return `query {
      transferFromL1Completeds(
        where: {
          recipient: "${recipient}"
        },
        orderBy: timestamp,
        orderDirection: desc
      ) {
        timestamp
        amount
        transactionHash
        token
        timestamp
      }
    }
  `;
}
function getDestinationTxHashFromL2Source(transferId) {
    return `query {
      withdrawalBondeds(
        where: {
          transferId: "${transferId}"
        }
      ) {
        timestamp
        amount
        transactionHash
        token
        timestamp
      }
    }
  `;
}
function getTransferIdByTxHash(txHash) {
    return `query {
      transferSents(
        where: {
          transactionHash: "${txHash}"
        }
      ) {
        timestamp
        transferId
        amount
        bonderFee
        transactionHash
        token
        timestamp
      }
    }
  `;
}
exports.getTransferIdByTxHash = getTransferIdByTxHash;
function getDestinationTxGQL(transferId, recipient, isFromL1Source) {
    return isFromL1Source ? getDestinationTxHashFromL1Source(recipient) : getDestinationTxHashFromL2Source(transferId);
}
exports.getDestinationTxGQL = getDestinationTxGQL;
//# sourceMappingURL=queries.js.map