"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("..");
const __2 = require("../..");
const parsers_1 = require("../../parsers");
const ValidationError_1 = require("../../LiqualityErrors/ValidationError");
describe('UniswapV2Error parser', () => {
    const parser = (0, __2.getErrorParser)(parsers_1.ChainifyErrorParser);
    const UNISWAP_V2_K_ERROR = 'cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ] (reason="execution reverted: UniswapV2: K", method="estimateGas", transaction={"from":"0x684C4274202a003fEbB2C12f6016aF090EbeC3aE","maxPriorityFeePerGas":{"type":"BigNumber","hex":"0x4c25524c"},"maxFeePerGas":{"type":"BigNumber","hex":"0x03a8c924a8"},"to":"0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D","value":{"type":"BigNumber","hex":"0x00"},"data":"0x18cbafe50000000000000000000000000000000000000000000000000097a5c8063cd000000000000000000000000000000000000000000000000000009429ae7945c24f00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000684c4274202a003febb2c12f6016af090ebec3ae000000000000000000000000000000000000000000000000000000006384c60b0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000ae7ab96520de3a18e5e111b5eaab095312d7fe84000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","type":2,"accessList":null}, error={"reason":"processing response error","code":"SERVER_ERROR","body":"{"jsonrpc":"2.0","id":124,"error":{"code":3,"data":"0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c556e697377617056323a204b0000000000000000000000000000000000000000","message":"execution reverted: UniswapV2: K"}}","error":{"code":3,"data":"0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000c556e697377617056323a204b0000000000000000000000000000000000000000"},"requestBody":"{"method":"eth_estimateGas","params":[{"type":"0x2","maxFeePerGas":"0x3a8c924a8","maxPriorityFeePerGas":"0x4c25524c","value":"0x0","from":"0x684c4274202a003febb2c12f6016af090ebec3ae","to":"0x7a250d5630b4cf539739df2c5dacb4c659f2488d","data":"0x18cbafe50000000000000000000000000000000000000000000000000097a5c8063cd000000000000000000000000000000000000000000000000000009429ae7945c24f00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000684c4274202a003febb2c12f6016af090ebec3ae000000000000000000000000000000000000000000000000000000006384c60b0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000ae7ab96520de3a18e5e111b5eaab095312d7fe84000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}],"id":124,"jsonrpc":"2.0"}","requestMethod":"POST","url":"https://mainnet.infura.io/v3/a2ad6f8c0e57453ca4918331f16de87d"}, code=UNPREDICTABLE_GAS_LIMIT, version=providers/5.7.0)"';
    const errorMap = [[UNISWAP_V2_K_ERROR, ValidationError_1.ValidationError.name]];
    it('should not log anything to console', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const logSpy = jest.spyOn(console, 'log');
        (0, __1.getError)(() => {
            return parser.wrap(() => {
                throw __1.FAKE_ERROR;
            }, null);
        });
        yield (0, __1.getErrorAsync)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return yield parser.wrapAsync(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw __1.FAKE_ERROR;
            }), null);
        }));
        expect(logSpy).toHaveBeenCalledTimes(0);
    }));
    it.each(errorMap)("should map '%s' => '%s'", (sourceError, liqError) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const validError = {
            message: sourceError,
            name: 'NodeError',
        };
        const error = (0, __1.getError)(() => {
            parser.wrap(() => {
                throw validError;
            }, null);
        });
        expect(error.name).toBe(liqError);
        expect(error.source).toBe(parsers_1.UniswapV2SwapErroParser.errorSource);
        expect(error.rawError).toBe(validError);
        const error1 = yield (0, __1.getErrorAsync)(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield parser.wrapAsync(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                throw validError;
            }), null);
        }));
        expect(error1.name).toBe(liqError);
        expect(error1.source).toBe(parsers_1.UniswapV2SwapErroParser.errorSource);
        expect(error1.rawError).toBe(validError);
    }));
});
//# sourceMappingURL=uniswapV2.test.js.map