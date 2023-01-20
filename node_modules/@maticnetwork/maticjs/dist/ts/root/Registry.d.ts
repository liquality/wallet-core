import { Contract } from 'web3-eth-contract';
import ContractsBase from '../common/ContractsBase';
import { MaticClientInitializationOptions } from '../types/Common';
import Web3Client from '../common/Web3Client';
export default class Registry extends ContractsBase {
    registry: Contract;
    constructor(options: MaticClientInitializationOptions, web3Client: Web3Client);
}
