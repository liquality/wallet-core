declare function setLastCheckedBitcoinBlock(blockNumber: any, taskName?: string): Promise<any>;
declare function getLastCheckedBitcoinBlock(taskName?: string): Promise<any>;
declare function setLastCheckedEthBlock(blockNumber: any, taskName?: string): Promise<any>;
declare function getLastCheckedEthBlock(taskName?: string): Promise<any>;
import slashUser = require("./slash-user");
import slashLocker = require("./slash-locker");
export declare namespace general {
    export { setLastCheckedBitcoinBlock };
    export { getLastCheckedBitcoinBlock };
    export { setLastCheckedEthBlock };
    export { getLastCheckedEthBlock };
}
export { slashUser, slashLocker };
