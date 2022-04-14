import * as ethers from 'ethers';
import abi from 'human-standard-token-abi';

const hstInterface = new ethers.utils.Interface(abi);

export const parseTokenTx = (data) => hstInterface.parseTransaction({ data });
