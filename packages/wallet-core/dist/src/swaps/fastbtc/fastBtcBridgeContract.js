"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRIDGE_CONTRACT_ABI = exports.BitcoinTransferStruct = exports.BitcoinTransferStatus = void 0;
var BitcoinTransferStatus;
(function (BitcoinTransferStatus) {
    BitcoinTransferStatus[BitcoinTransferStatus["NOT_APPLICABLE"] = 0] = "NOT_APPLICABLE";
    BitcoinTransferStatus[BitcoinTransferStatus["NEW"] = 1] = "NEW";
    BitcoinTransferStatus[BitcoinTransferStatus["SENDING"] = 2] = "SENDING";
    BitcoinTransferStatus[BitcoinTransferStatus["MINED"] = 3] = "MINED";
    BitcoinTransferStatus[BitcoinTransferStatus["REFUNDED"] = 4] = "REFUNDED";
    BitcoinTransferStatus[BitcoinTransferStatus["RECLAIMED"] = 5] = "RECLAIMED";
})(BitcoinTransferStatus = exports.BitcoinTransferStatus || (exports.BitcoinTransferStatus = {}));
exports.BitcoinTransferStruct = '(address rskAddress, uint8 status, uint8 nonce, uint8 feeStructureIndex, uint32 blockNumber, uint40 totalAmountSatoshi, string btcAddress)';
exports.BRIDGE_CONTRACT_ABI = [
    'event NewBitcoinTransfer(bytes32 indexed transferId, string btcAddress, uint256 nonce, uint256 amountSatoshi, uint256 feeSatoshi, address indexed rskAddress)',
    'event BitcoinTransferStatusUpdated(bytes32 indexed transferId, uint8 newStatus)',
    'event BitcoinTransferBatchSending(bytes32 bitcoinTxHash, uint8 transferBatchSize)',
    'function minTransferSatoshi() view returns (uint40)',
    'function maxTransferSatoshi() view returns (uint40)',
    'function calculateCurrentFeeSatoshi(uint256 amountSatoshi) public view returns (uint256)',
    'function transferToBtc (string calldata btcAddress) external payable',
    `function getTransferByTransferId(bytes32 transferId) public view returns (${exports.BitcoinTransferStruct})`,
];
//# sourceMappingURL=fastBtcBridgeContract.js.map