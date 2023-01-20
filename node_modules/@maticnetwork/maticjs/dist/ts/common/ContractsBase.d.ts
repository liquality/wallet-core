import BN from 'bn.js';
import Web3Client from './Web3Client';
import { address } from '../types/Common';
export default class ContractsBase {
    static MATIC_CHILD_TOKEN: address;
    web3Client: Web3Client;
    network: any;
    constructor(web3Client: Web3Client, network: any);
    encode(number: BN | string | number): string;
    getERC20TokenContract(token: address, parent?: boolean): import("web3-eth-contract").Contract;
    getERC721TokenContract(token: address, parent?: boolean): import("web3-eth-contract").Contract;
    getChildMaticContract(): import("web3-eth-contract").Contract;
    getPOSERC20TokenContract(token: address, parent?: boolean): import("web3-eth-contract").Contract;
    getPOSERC721TokenContract(token: address, parent?: boolean): import("web3-eth-contract").Contract;
    getPOSERC1155TokenContract(token: address, parent?: boolean): import("web3-eth-contract").Contract;
}
