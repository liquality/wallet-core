import { Contract } from 'web3-eth-contract';
import ContractsBase from '../common/ContractsBase';
import { MaticClientInitializationOptions } from '../types/Common';
import Web3Client from '../common/Web3Client';
import BN from 'bn.js';
export default class RootChain extends ContractsBase {
    static BIG_ONE: BN;
    static BIG_TWO: BN;
    static CHECKPOINT_ID_INTERVAL: BN;
    rootChain: Contract;
    constructor(options: MaticClientInitializationOptions, web3Client: Web3Client);
    getLastChildBlock(): Promise<any>;
    getCheckpointInclusion(burnTxHash: any): Promise<any>;
    findHeaderBlockNumber(childBlockNumber: BN | string | number): Promise<BN>;
}
