// Status of an rBTC-to-BTC transfer.
export enum BitcoinTransferStatus {
  NOT_APPLICABLE = 0, // the transfer slot has not been initialized
  NEW, // the transfer was initiated
  SENDING, // the federators have approved this transfer as part of a transfer batch
  MINED, // the transfer was confirmedly mined in Bitcoin blockchain
  REFUNDED, // the transfer was refunded
  RECLAIMED, // the transfer was reclaimed by the user
}

export interface BitcoinTransfer {
  rskAddress: string; // source rskAddress
  status: BitcoinTransferStatus; // the current status
  nonce: number; // each Bitcoin address can be reused up to 255 times
  feeStructureIndex: number; // the fee calculation to be applied to this transfer
  blockNumber: number; // the RSK block number where this was initialized
  totalAmountSatoshi: number; // the number of BTC satoshis that the user sent
  btcAddress: string; // the BTC address in legacy or Bech32 encoded format
}

export const BitcoinTransferStruct =
  '(address rskAddress, uint8 status, uint8 nonce, uint8 feeStructureIndex, uint32 blockNumber, uint40 totalAmountSatoshi, string btcAddress)';

export const BRIDGE_CONTRACT_ABI = [
  'event NewBitcoinTransfer(bytes32 indexed transferId, string btcAddress, uint256 nonce, uint256 amountSatoshi, uint256 feeSatoshi, address indexed rskAddress)',
  'event BitcoinTransferStatusUpdated(bytes32 indexed transferId, uint8 newStatus)',
  'event BitcoinTransferBatchSending(bytes32 bitcoinTxHash, uint8 transferBatchSize)',
  'function minTransferSatoshi() view returns (uint40)',
  'function maxTransferSatoshi() view returns (uint40)',
  'function calculateCurrentFeeSatoshi(uint256 amountSatoshi) public view returns (uint256)',
  'function transferToBtc (string calldata btcAddress) external payable',
  `function getTransferByTransferId(bytes32 transferId) public view returns (${BitcoinTransferStruct})`,
];
