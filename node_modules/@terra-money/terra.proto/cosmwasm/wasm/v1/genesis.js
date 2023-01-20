"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequence = exports.Contract = exports.Code = exports.GenesisState_GenMsgs = exports.GenesisState = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const types_1 = require("../../../cosmwasm/wasm/v1/types");
const tx_1 = require("../../../cosmwasm/wasm/v1/tx");
exports.protobufPackage = "cosmwasm.wasm.v1";
const baseGenesisState = {};
exports.GenesisState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.params !== undefined) {
            types_1.Params.encode(message.params, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.codes) {
            exports.Code.encode(v, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.contracts) {
            exports.Contract.encode(v, writer.uint32(26).fork()).ldelim();
        }
        for (const v of message.sequences) {
            exports.Sequence.encode(v, writer.uint32(34).fork()).ldelim();
        }
        for (const v of message.genMsgs) {
            exports.GenesisState_GenMsgs.encode(v, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseGenesisState);
        message.codes = [];
        message.contracts = [];
        message.sequences = [];
        message.genMsgs = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.params = types_1.Params.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.codes.push(exports.Code.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.contracts.push(exports.Contract.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.sequences.push(exports.Sequence.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.genMsgs.push(exports.GenesisState_GenMsgs.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseGenesisState);
        message.codes = [];
        message.contracts = [];
        message.sequences = [];
        message.genMsgs = [];
        if (object.params !== undefined && object.params !== null) {
            message.params = types_1.Params.fromJSON(object.params);
        }
        else {
            message.params = undefined;
        }
        if (object.codes !== undefined && object.codes !== null) {
            for (const e of object.codes) {
                message.codes.push(exports.Code.fromJSON(e));
            }
        }
        if (object.contracts !== undefined && object.contracts !== null) {
            for (const e of object.contracts) {
                message.contracts.push(exports.Contract.fromJSON(e));
            }
        }
        if (object.sequences !== undefined && object.sequences !== null) {
            for (const e of object.sequences) {
                message.sequences.push(exports.Sequence.fromJSON(e));
            }
        }
        if (object.genMsgs !== undefined && object.genMsgs !== null) {
            for (const e of object.genMsgs) {
                message.genMsgs.push(exports.GenesisState_GenMsgs.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.params !== undefined && (obj.params = message.params ? types_1.Params.toJSON(message.params) : undefined);
        if (message.codes) {
            obj.codes = message.codes.map((e) => (e ? exports.Code.toJSON(e) : undefined));
        }
        else {
            obj.codes = [];
        }
        if (message.contracts) {
            obj.contracts = message.contracts.map((e) => (e ? exports.Contract.toJSON(e) : undefined));
        }
        else {
            obj.contracts = [];
        }
        if (message.sequences) {
            obj.sequences = message.sequences.map((e) => (e ? exports.Sequence.toJSON(e) : undefined));
        }
        else {
            obj.sequences = [];
        }
        if (message.genMsgs) {
            obj.genMsgs = message.genMsgs.map((e) => (e ? exports.GenesisState_GenMsgs.toJSON(e) : undefined));
        }
        else {
            obj.genMsgs = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseGenesisState);
        message.codes = [];
        message.contracts = [];
        message.sequences = [];
        message.genMsgs = [];
        if (object.params !== undefined && object.params !== null) {
            message.params = types_1.Params.fromPartial(object.params);
        }
        else {
            message.params = undefined;
        }
        if (object.codes !== undefined && object.codes !== null) {
            for (const e of object.codes) {
                message.codes.push(exports.Code.fromPartial(e));
            }
        }
        if (object.contracts !== undefined && object.contracts !== null) {
            for (const e of object.contracts) {
                message.contracts.push(exports.Contract.fromPartial(e));
            }
        }
        if (object.sequences !== undefined && object.sequences !== null) {
            for (const e of object.sequences) {
                message.sequences.push(exports.Sequence.fromPartial(e));
            }
        }
        if (object.genMsgs !== undefined && object.genMsgs !== null) {
            for (const e of object.genMsgs) {
                message.genMsgs.push(exports.GenesisState_GenMsgs.fromPartial(e));
            }
        }
        return message;
    },
};
const baseGenesisState_GenMsgs = {};
exports.GenesisState_GenMsgs = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.storeCode !== undefined) {
            tx_1.MsgStoreCode.encode(message.storeCode, writer.uint32(10).fork()).ldelim();
        }
        if (message.instantiateContract !== undefined) {
            tx_1.MsgInstantiateContract.encode(message.instantiateContract, writer.uint32(18).fork()).ldelim();
        }
        if (message.executeContract !== undefined) {
            tx_1.MsgExecuteContract.encode(message.executeContract, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseGenesisState_GenMsgs);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.storeCode = tx_1.MsgStoreCode.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.instantiateContract = tx_1.MsgInstantiateContract.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.executeContract = tx_1.MsgExecuteContract.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseGenesisState_GenMsgs);
        if (object.storeCode !== undefined && object.storeCode !== null) {
            message.storeCode = tx_1.MsgStoreCode.fromJSON(object.storeCode);
        }
        else {
            message.storeCode = undefined;
        }
        if (object.instantiateContract !== undefined && object.instantiateContract !== null) {
            message.instantiateContract = tx_1.MsgInstantiateContract.fromJSON(object.instantiateContract);
        }
        else {
            message.instantiateContract = undefined;
        }
        if (object.executeContract !== undefined && object.executeContract !== null) {
            message.executeContract = tx_1.MsgExecuteContract.fromJSON(object.executeContract);
        }
        else {
            message.executeContract = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.storeCode !== undefined &&
            (obj.storeCode = message.storeCode ? tx_1.MsgStoreCode.toJSON(message.storeCode) : undefined);
        message.instantiateContract !== undefined &&
            (obj.instantiateContract = message.instantiateContract
                ? tx_1.MsgInstantiateContract.toJSON(message.instantiateContract)
                : undefined);
        message.executeContract !== undefined &&
            (obj.executeContract = message.executeContract
                ? tx_1.MsgExecuteContract.toJSON(message.executeContract)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseGenesisState_GenMsgs);
        if (object.storeCode !== undefined && object.storeCode !== null) {
            message.storeCode = tx_1.MsgStoreCode.fromPartial(object.storeCode);
        }
        else {
            message.storeCode = undefined;
        }
        if (object.instantiateContract !== undefined && object.instantiateContract !== null) {
            message.instantiateContract = tx_1.MsgInstantiateContract.fromPartial(object.instantiateContract);
        }
        else {
            message.instantiateContract = undefined;
        }
        if (object.executeContract !== undefined && object.executeContract !== null) {
            message.executeContract = tx_1.MsgExecuteContract.fromPartial(object.executeContract);
        }
        else {
            message.executeContract = undefined;
        }
        return message;
    },
};
const baseCode = { codeId: long_1.default.UZERO, pinned: false };
exports.Code = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.codeId.isZero()) {
            writer.uint32(8).uint64(message.codeId);
        }
        if (message.codeInfo !== undefined) {
            types_1.CodeInfo.encode(message.codeInfo, writer.uint32(18).fork()).ldelim();
        }
        if (message.codeBytes.length !== 0) {
            writer.uint32(26).bytes(message.codeBytes);
        }
        if (message.pinned === true) {
            writer.uint32(32).bool(message.pinned);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseCode);
        message.codeBytes = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeId = reader.uint64();
                    break;
                case 2:
                    message.codeInfo = types_1.CodeInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.codeBytes = reader.bytes();
                    break;
                case 4:
                    message.pinned = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseCode);
        message.codeBytes = new Uint8Array();
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = long_1.default.fromString(object.codeId);
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        if (object.codeInfo !== undefined && object.codeInfo !== null) {
            message.codeInfo = types_1.CodeInfo.fromJSON(object.codeInfo);
        }
        else {
            message.codeInfo = undefined;
        }
        if (object.codeBytes !== undefined && object.codeBytes !== null) {
            message.codeBytes = bytesFromBase64(object.codeBytes);
        }
        if (object.pinned !== undefined && object.pinned !== null) {
            message.pinned = Boolean(object.pinned);
        }
        else {
            message.pinned = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.codeId !== undefined && (obj.codeId = (message.codeId || long_1.default.UZERO).toString());
        message.codeInfo !== undefined &&
            (obj.codeInfo = message.codeInfo ? types_1.CodeInfo.toJSON(message.codeInfo) : undefined);
        message.codeBytes !== undefined &&
            (obj.codeBytes = base64FromBytes(message.codeBytes !== undefined ? message.codeBytes : new Uint8Array()));
        message.pinned !== undefined && (obj.pinned = message.pinned);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseCode);
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = object.codeId;
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        if (object.codeInfo !== undefined && object.codeInfo !== null) {
            message.codeInfo = types_1.CodeInfo.fromPartial(object.codeInfo);
        }
        else {
            message.codeInfo = undefined;
        }
        if (object.codeBytes !== undefined && object.codeBytes !== null) {
            message.codeBytes = object.codeBytes;
        }
        else {
            message.codeBytes = new Uint8Array();
        }
        if (object.pinned !== undefined && object.pinned !== null) {
            message.pinned = object.pinned;
        }
        else {
            message.pinned = false;
        }
        return message;
    },
};
const baseContract = { contractAddress: "" };
exports.Contract = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.contractAddress !== "") {
            writer.uint32(10).string(message.contractAddress);
        }
        if (message.contractInfo !== undefined) {
            types_1.ContractInfo.encode(message.contractInfo, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.contractState) {
            types_1.Model.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseContract);
        message.contractState = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.contractAddress = reader.string();
                    break;
                case 2:
                    message.contractInfo = types_1.ContractInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.contractState.push(types_1.Model.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseContract);
        message.contractState = [];
        if (object.contractAddress !== undefined && object.contractAddress !== null) {
            message.contractAddress = String(object.contractAddress);
        }
        else {
            message.contractAddress = "";
        }
        if (object.contractInfo !== undefined && object.contractInfo !== null) {
            message.contractInfo = types_1.ContractInfo.fromJSON(object.contractInfo);
        }
        else {
            message.contractInfo = undefined;
        }
        if (object.contractState !== undefined && object.contractState !== null) {
            for (const e of object.contractState) {
                message.contractState.push(types_1.Model.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
        message.contractInfo !== undefined &&
            (obj.contractInfo = message.contractInfo ? types_1.ContractInfo.toJSON(message.contractInfo) : undefined);
        if (message.contractState) {
            obj.contractState = message.contractState.map((e) => (e ? types_1.Model.toJSON(e) : undefined));
        }
        else {
            obj.contractState = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseContract);
        message.contractState = [];
        if (object.contractAddress !== undefined && object.contractAddress !== null) {
            message.contractAddress = object.contractAddress;
        }
        else {
            message.contractAddress = "";
        }
        if (object.contractInfo !== undefined && object.contractInfo !== null) {
            message.contractInfo = types_1.ContractInfo.fromPartial(object.contractInfo);
        }
        else {
            message.contractInfo = undefined;
        }
        if (object.contractState !== undefined && object.contractState !== null) {
            for (const e of object.contractState) {
                message.contractState.push(types_1.Model.fromPartial(e));
            }
        }
        return message;
    },
};
const baseSequence = { value: long_1.default.UZERO };
exports.Sequence = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.idKey.length !== 0) {
            writer.uint32(10).bytes(message.idKey);
        }
        if (!message.value.isZero()) {
            writer.uint32(16).uint64(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSequence);
        message.idKey = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.idKey = reader.bytes();
                    break;
                case 2:
                    message.value = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSequence);
        message.idKey = new Uint8Array();
        if (object.idKey !== undefined && object.idKey !== null) {
            message.idKey = bytesFromBase64(object.idKey);
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = long_1.default.fromString(object.value);
        }
        else {
            message.value = long_1.default.UZERO;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.idKey !== undefined &&
            (obj.idKey = base64FromBytes(message.idKey !== undefined ? message.idKey : new Uint8Array()));
        message.value !== undefined && (obj.value = (message.value || long_1.default.UZERO).toString());
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSequence);
        if (object.idKey !== undefined && object.idKey !== null) {
            message.idKey = object.idKey;
        }
        else {
            message.idKey = new Uint8Array();
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = object.value;
        }
        else {
            message.value = long_1.default.UZERO;
        }
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob || ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa || ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=genesis.js.map