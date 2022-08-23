// L1->L2
function getDestinationTxHashFromL1Source(recipient: string) {
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

// L2->L1 or L2->L2
function getDestinationTxHashFromL2Source(transferId: string) {
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

export function getTransferIdByTxHash(txHash: string) {
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

export function getDestinationTxGQL(transferId: string, recipient: string, isFromL1Source: boolean) {
  return isFromL1Source ? getDestinationTxHashFromL1Source(recipient) : getDestinationTxHashFromL2Source(transferId);
}
