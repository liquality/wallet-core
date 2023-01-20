export function calculateFee({ amount, type, teleporterFeeRatio, minimumFee, targetNetworkConnectionInfo, testnet, feeParams, }: {
    amount: any;
    type?: string | undefined;
    teleporterFeeRatio?: number | undefined;
    minimumFee?: number | undefined;
    targetNetworkConnectionInfo: any;
    testnet?: boolean | undefined;
    feeParams?: undefined;
}): Promise<{
    teleporterPercentageFee: string;
    protocolPercentageFee: any;
    lockerPercentageFee: any;
    teleporterFeeInBTC: string;
    protocolFeeInBTC: string;
    lockerFeeInBTC: string;
    TransactionFeeInBTC: string;
    totalFeeInBTC: string;
    receivedAmount: string;
} | {
    protocolPercentageFee: any;
    lockerPercentageFee: any;
    instantSettlementPercentageFee: any;
    protocolFeeInBTC: string;
    burnBitcoinFeeInBTC: string;
    lockerFeeInBTC: string;
    instantSettlementFeeInBTC: string;
    totalFeeInBTC: string;
    receivedAmount: string;
}>;
export function getFeeParams({ targetNetworkConnectionInfo, testnet }: {
    targetNetworkConnectionInfo: any;
    testnet?: boolean | undefined;
}): Promise<{
    price: any;
    gasPrize: any;
    lastRelayBlockFee: any;
    relayFee: string;
    teleportFee: string;
    protocolPercentageFeeCCTransfer: number;
    protocolPercentageFeeCCExchange: number;
    protocolPercentageFeeCCBurn: number;
    burnBitcoinFee: number;
    lockerPercentageFee: number;
    feeRate: number;
}>;
