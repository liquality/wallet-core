import * as ethers from 'ethers';
import abi from 'human-standard-token-abi';

const hstInterface = new ethers.utils.Interface(abi);

export const parseTokenTx = (data: string) => hstInterface.parseTransaction({ data });
