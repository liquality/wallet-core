"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInstantiateConfigProposal = exports.AccessConfigUpdate = exports.UnpinCodesProposal = exports.PinCodesProposal = exports.ClearAdminProposal = exports.UpdateAdminProposal = exports.ExecuteContractProposal = exports.SudoContractProposal = exports.MigrateContractProposal = exports.InstantiateContractProposal = exports.StoreCodeProposal = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const types_1 = require("../../../cosmwasm/wasm/v1/types");
const coin_1 = require("../../../cosmos/base/v1beta1/coin");
exports.protobufPackage = "cosmwasm.wasm.v1";
const baseStoreCodeProposal = { title: "", description: "", runAs: "" };
exports.StoreCodeProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.runAs !== "") {
            writer.uint32(26).string(message.runAs);
        }
        if (message.wasmByteCode.length !== 0) {
            writer.uint32(34).bytes(message.wasmByteCode);
        }
        if (message.instantiatePermission !== undefined) {
            types_1.AccessConfig.encode(message.instantiatePermission, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseStoreCodeProposal);
        message.wasmByteCode = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    message.runAs = reader.string();
                    break;
                case 4:
                    message.wasmByteCode = reader.bytes();
                    break;
                case 7:
                    message.instantiatePermission = types_1.AccessConfig.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseStoreCodeProposal);
        message.wasmByteCode = new Uint8Array();
        if (object.title !== undefined && object.title !== null) {
            message.title = String(object.title);
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = String(object.description);
        }
        else {
            message.description = "";
        }
        if (object.runAs !== undefined && object.runAs !== null) {
            message.runAs = String(object.runAs);
        }
        else {
            message.runAs = "";
        }
        if (object.wasmByteCode !== undefined && object.wasmByteCode !== null) {
            message.wasmByteCode = bytesFromBase64(object.wasmByteCode);
        }
        if (object.instantiatePermission !== undefined && object.instantiatePermission !== null) {
            message.instantiatePermission = types_1.AccessConfig.fromJSON(object.instantiatePermission);
        }
        else {
            message.instantiatePermission = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined && (obj.description = message.description);
        message.runAs !== undefined && (obj.runAs = message.runAs);
        message.wasmByteCode !== undefined &&
            (obj.wasmByteCode = base64FromBytes(message.wasmByteCode !== undefined ? message.wasmByteCode : new Uint8Array()));
        message.instantiatePermission !== undefined &&
            (obj.instantiatePermission = message.instantiatePermission
                ? types_1.AccessConfig.toJSON(message.instantiatePermission)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseStoreCodeProposal);
        if (object.title !== undefined && object.title !== null) {
            message.title = object.title;
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = object.description;
        }
        else {
            message.description = "";
        }
        if (object.runAs !== undefined && object.runAs !== null) {
            message.runAs = object.runAs;
        }
        else {
            message.runAs = "";
        }
        if (object.wasmByteCode !== undefined && object.wasmByteCode !== null) {
            message.wasmByteCode = object.wasmByteCode;
        }
        else {
            message.wasmByteCode = new Uint8Array();
        }
        if (object.instantiatePermission !== undefined && object.instantiatePermission !== null) {
            message.instantiatePermission = types_1.AccessConfig.fromPartial(object.instantiatePermission);
        }
        else {
            message.instantiatePermission = undefined;
        }
        return message;
    },
};
const baseInstantiateContractProposal = {
    title: "",
    description: "",
    runAs: "",
    admin: "",
    codeId: long_1.default.UZERO,
    label: "",
};
exports.InstantiateContractProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.runAs !== "") {
            writer.uint32(26).string(message.runAs);
        }
        if (message.admin !== "") {
            writer.uint32(34).string(message.admin);
        }
        if (!message.codeId.isZero()) {
            writer.uint32(40).uint64(message.codeId);
        }
        if (message.label !== "") {
            writer.uint32(50).string(message.label);
        }
        if (message.msg.length !== 0) {
            writer.uint32(58).bytes(message.msg);
        }
        for (const v of message.funds) {
            coin_1.Coin.encode(v, writer.uint32(66).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseInstantiateContractProposal);
        message.funds = [];
        message.msg = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    message.runAs = reader.string();
                    break;
                case 4:
                    message.admin = reader.string();
                    break;
                case 5:
                    message.codeId = reader.uint64();
                    break;
                case 6:
                    message.label = reader.string();
                    break;
                case 7:
                    message.msg = reader.bytes();
                    break;
                case 8:
                    message.funds.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseInstantiateContractProposal);
        message.funds = [];
        message.msg = new Uint8Array();
        if (object.title !== undefined && object.title !== null) {
            message.title = String(object.title);
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = String(object.description);
        }
        else {
            message.description = "";
        }
        if (object.runAs !== undefined && object.runAs !== null) {
            message.runAs = String(object.runAs);
        }
        else {
            message.runAs = "";
        }
        if (object.admin !== undefined && object.admin !== null) {
            message.admin = String(object.admin);
        }
        else {
            message.admin = "";
        }
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = long_1.default.fromString(object.codeId);
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        if (object.label !== undefined && object.label !== null) {
            message.label = String(object.label);
        }
        else {
            message.label = "";
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = bytesFromBase64(object.msg);
        }
        if (object.funds !== undefined && object.funds !== null) {
            for (const e of object.funds) {
                message.funds.push(coin_1.Coin.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined && (obj.description = message.description);
        message.runAs !== undefined && (obj.runAs = message.runAs);
        message.admin !== undefined && (obj.admin = message.admin);
        message.codeId !== undefined && (obj.codeId = (message.codeId || long_1.default.UZERO).toString());
        message.label !== undefined && (obj.label = message.label);
        message.msg !== undefined &&
            (obj.msg = base64FromBytes(message.msg !== undefined ? message.msg : new Uint8Array()));
        if (message.funds) {
            obj.funds = message.funds.map((e) => (e ? coin_1.Coin.toJSON(e) : undefined));
        }
        else {
            obj.funds = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseInstantiateContractProposal);
        message.funds = [];
        if (object.title !== undefined && object.title !== null) {
            message.title = object.title;
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = object.description;
        }
        else {
            message.description = "";
        }
        if (object.runAs !== undefined && object.runAs !== null) {
            message.runAs = object.runAs;
        }
        else {
            message.runAs = "";
        }
        if (object.admin !== undefined && object.admin !== null) {
            message.admin = object.admin;
        }
        else {
            message.admin = "";
        }
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = object.codeId;
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        if (object.label !== undefined && object.label !== null) {
            message.label = object.label;
        }
        else {
            message.label = "";
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = object.msg;
        }
        else {
            message.msg = new Uint8Array();
        }
        if (object.funds !== undefined && object.funds !== null) {
            for (const e of object.funds) {
                message.funds.push(coin_1.Coin.fromPartial(e));
            }
        }
        return message;
    },
};
const baseMigrateContractProposal = { title: "", description: "", contract: "", codeId: long_1.default.UZERO };
exports.MigrateContractProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.contract !== "") {
            writer.uint32(34).string(message.contract);
        }
        if (!message.codeId.isZero()) {
            writer.uint32(40).uint64(message.codeId);
        }
        if (message.msg.length !== 0) {
            writer.uint32(50).bytes(message.msg);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMigrateContractProposal);
        message.msg = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 4:
                    message.contract = reader.string();
                    break;
                case 5:
                    message.codeId = reader.uint64();
                    break;
                case 6:
                    message.msg = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMigrateContractProposal);
        message.msg = new Uint8Array();
        if (object.title !== undefined && object.title !== null) {
            message.title = String(object.title);
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = String(object.description);
        }
        else {
            message.description = "";
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = String(object.contract);
        }
        else {
            message.contract = "";
        }
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = long_1.default.fromString(object.codeId);
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = bytesFromBase64(object.msg);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined && (obj.description = message.description);
        message.contract !== undefined && (obj.contract = message.contract);
        message.codeId !== undefined && (obj.codeId = (message.codeId || long_1.default.UZERO).toString());
        message.msg !== undefined &&
            (obj.msg = base64FromBytes(message.msg !== undefined ? message.msg : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMigrateContractProposal);
        if (object.title !== undefined && object.title !== null) {
            message.title = object.title;
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = object.description;
        }
        else {
            message.description = "";
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = object.contract;
        }
        else {
            message.contract = "";
        }
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = object.codeId;
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = object.msg;
        }
        else {
            message.msg = new Uint8Array();
        }
        return message;
    },
};
const baseSudoContractProposal = { title: "", description: "", contract: "" };
exports.SudoContractProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.contract !== "") {
            writer.uint32(26).string(message.contract);
        }
        if (message.msg.length !== 0) {
            writer.uint32(34).bytes(message.msg);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseSudoContractProposal);
        message.msg = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    message.contract = reader.string();
                    break;
                case 4:
                    message.msg = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseSudoContractProposal);
        message.msg = new Uint8Array();
        if (object.title !== undefined && object.title !== null) {
            message.title = String(object.title);
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = String(object.description);
        }
        else {
            message.description = "";
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = String(object.contract);
        }
        else {
            message.contract = "";
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = bytesFromBase64(object.msg);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined && (obj.description = message.description);
        message.contract !== undefined && (obj.contract = message.contract);
        message.msg !== undefined &&
            (obj.msg = base64FromBytes(message.msg !== undefined ? message.msg : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseSudoContractProposal);
        if (object.title !== undefined && object.title !== null) {
            message.title = object.title;
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = object.description;
        }
        else {
            message.description = "";
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = object.contract;
        }
        else {
            message.contract = "";
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = object.msg;
        }
        else {
            message.msg = new Uint8Array();
        }
        return message;
    },
};
const baseExecuteContractProposal = { title: "", description: "", runAs: "", contract: "" };
exports.ExecuteContractProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.runAs !== "") {
            writer.uint32(26).string(message.runAs);
        }
        if (message.contract !== "") {
            writer.uint32(34).string(message.contract);
        }
        if (message.msg.length !== 0) {
            writer.uint32(42).bytes(message.msg);
        }
        for (const v of message.funds) {
            coin_1.Coin.encode(v, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseExecuteContractProposal);
        message.funds = [];
        message.msg = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    message.runAs = reader.string();
                    break;
                case 4:
                    message.contract = reader.string();
                    break;
                case 5:
                    message.msg = reader.bytes();
                    break;
                case 6:
                    message.funds.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseExecuteContractProposal);
        message.funds = [];
        message.msg = new Uint8Array();
        if (object.title !== undefined && object.title !== null) {
            message.title = String(object.title);
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = String(object.description);
        }
        else {
            message.description = "";
        }
        if (object.runAs !== undefined && object.runAs !== null) {
            message.runAs = String(object.runAs);
        }
        else {
            message.runAs = "";
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = String(object.contract);
        }
        else {
            message.contract = "";
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = bytesFromBase64(object.msg);
        }
        if (object.funds !== undefined && object.funds !== null) {
            for (const e of object.funds) {
                message.funds.push(coin_1.Coin.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined && (obj.description = message.description);
        message.runAs !== undefined && (obj.runAs = message.runAs);
        message.contract !== undefined && (obj.contract = message.contract);
        message.msg !== undefined &&
            (obj.msg = base64FromBytes(message.msg !== undefined ? message.msg : new Uint8Array()));
        if (message.funds) {
            obj.funds = message.funds.map((e) => (e ? coin_1.Coin.toJSON(e) : undefined));
        }
        else {
            obj.funds = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseExecuteContractProposal);
        message.funds = [];
        if (object.title !== undefined && object.title !== null) {
            message.title = object.title;
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = object.description;
        }
        else {
            message.description = "";
        }
        if (object.runAs !== undefined && object.runAs !== null) {
            message.runAs = object.runAs;
        }
        else {
            message.runAs = "";
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = object.contract;
        }
        else {
            message.contract = "";
        }
        if (object.msg !== undefined && object.msg !== null) {
            message.msg = object.msg;
        }
        else {
            message.msg = new Uint8Array();
        }
        if (object.funds !== undefined && object.funds !== null) {
            for (const e of object.funds) {
                message.funds.push(coin_1.Coin.fromPartial(e));
            }
        }
        return message;
    },
};
const baseUpdateAdminProposal = { title: "", description: "", newAdmin: "", contract: "" };
exports.UpdateAdminProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.newAdmin !== "") {
            writer.uint32(26).string(message.newAdmin);
        }
        if (message.contract !== "") {
            writer.uint32(34).string(message.contract);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUpdateAdminProposal);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    message.newAdmin = reader.string();
                    break;
                case 4:
                    message.contract = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUpdateAdminProposal);
        if (object.title !== undefined && object.title !== null) {
            message.title = String(object.title);
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = String(object.description);
        }
        else {
            message.description = "";
        }
        if (object.newAdmin !== undefined && object.newAdmin !== null) {
            message.newAdmin = String(object.newAdmin);
        }
        else {
            message.newAdmin = "";
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = String(object.contract);
        }
        else {
            message.contract = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined && (obj.description = message.description);
        message.newAdmin !== undefined && (obj.newAdmin = message.newAdmin);
        message.contract !== undefined && (obj.contract = message.contract);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseUpdateAdminProposal);
        if (object.title !== undefined && object.title !== null) {
            message.title = object.title;
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = object.description;
        }
        else {
            message.description = "";
        }
        if (object.newAdmin !== undefined && object.newAdmin !== null) {
            message.newAdmin = object.newAdmin;
        }
        else {
            message.newAdmin = "";
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = object.contract;
        }
        else {
            message.contract = "";
        }
        return message;
    },
};
const baseClearAdminProposal = { title: "", description: "", contract: "" };
exports.ClearAdminProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.contract !== "") {
            writer.uint32(26).string(message.contract);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseClearAdminProposal);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    message.contract = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseClearAdminProposal);
        if (object.title !== undefined && object.title !== null) {
            message.title = String(object.title);
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = String(object.description);
        }
        else {
            message.description = "";
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = String(object.contract);
        }
        else {
            message.contract = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined && (obj.description = message.description);
        message.contract !== undefined && (obj.contract = message.contract);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseClearAdminProposal);
        if (object.title !== undefined && object.title !== null) {
            message.title = object.title;
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = object.description;
        }
        else {
            message.description = "";
        }
        if (object.contract !== undefined && object.contract !== null) {
            message.contract = object.contract;
        }
        else {
            message.contract = "";
        }
        return message;
    },
};
const basePinCodesProposal = { title: "", description: "", codeIds: long_1.default.UZERO };
exports.PinCodesProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        writer.uint32(26).fork();
        for (const v of message.codeIds) {
            writer.uint64(v);
        }
        writer.ldelim();
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, basePinCodesProposal);
        message.codeIds = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.codeIds.push(reader.uint64());
                        }
                    }
                    else {
                        message.codeIds.push(reader.uint64());
                    }
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, basePinCodesProposal);
        message.codeIds = [];
        if (object.title !== undefined && object.title !== null) {
            message.title = String(object.title);
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = String(object.description);
        }
        else {
            message.description = "";
        }
        if (object.codeIds !== undefined && object.codeIds !== null) {
            for (const e of object.codeIds) {
                message.codeIds.push(long_1.default.fromString(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined && (obj.description = message.description);
        if (message.codeIds) {
            obj.codeIds = message.codeIds.map((e) => (e || long_1.default.UZERO).toString());
        }
        else {
            obj.codeIds = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, basePinCodesProposal);
        message.codeIds = [];
        if (object.title !== undefined && object.title !== null) {
            message.title = object.title;
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = object.description;
        }
        else {
            message.description = "";
        }
        if (object.codeIds !== undefined && object.codeIds !== null) {
            for (const e of object.codeIds) {
                message.codeIds.push(e);
            }
        }
        return message;
    },
};
const baseUnpinCodesProposal = { title: "", description: "", codeIds: long_1.default.UZERO };
exports.UnpinCodesProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        writer.uint32(26).fork();
        for (const v of message.codeIds) {
            writer.uint64(v);
        }
        writer.ldelim();
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUnpinCodesProposal);
        message.codeIds = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.codeIds.push(reader.uint64());
                        }
                    }
                    else {
                        message.codeIds.push(reader.uint64());
                    }
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUnpinCodesProposal);
        message.codeIds = [];
        if (object.title !== undefined && object.title !== null) {
            message.title = String(object.title);
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = String(object.description);
        }
        else {
            message.description = "";
        }
        if (object.codeIds !== undefined && object.codeIds !== null) {
            for (const e of object.codeIds) {
                message.codeIds.push(long_1.default.fromString(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined && (obj.description = message.description);
        if (message.codeIds) {
            obj.codeIds = message.codeIds.map((e) => (e || long_1.default.UZERO).toString());
        }
        else {
            obj.codeIds = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseUnpinCodesProposal);
        message.codeIds = [];
        if (object.title !== undefined && object.title !== null) {
            message.title = object.title;
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = object.description;
        }
        else {
            message.description = "";
        }
        if (object.codeIds !== undefined && object.codeIds !== null) {
            for (const e of object.codeIds) {
                message.codeIds.push(e);
            }
        }
        return message;
    },
};
const baseAccessConfigUpdate = { codeId: long_1.default.UZERO };
exports.AccessConfigUpdate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.codeId.isZero()) {
            writer.uint32(8).uint64(message.codeId);
        }
        if (message.instantiatePermission !== undefined) {
            types_1.AccessConfig.encode(message.instantiatePermission, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseAccessConfigUpdate);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeId = reader.uint64();
                    break;
                case 2:
                    message.instantiatePermission = types_1.AccessConfig.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseAccessConfigUpdate);
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = long_1.default.fromString(object.codeId);
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        if (object.instantiatePermission !== undefined && object.instantiatePermission !== null) {
            message.instantiatePermission = types_1.AccessConfig.fromJSON(object.instantiatePermission);
        }
        else {
            message.instantiatePermission = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.codeId !== undefined && (obj.codeId = (message.codeId || long_1.default.UZERO).toString());
        message.instantiatePermission !== undefined &&
            (obj.instantiatePermission = message.instantiatePermission
                ? types_1.AccessConfig.toJSON(message.instantiatePermission)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseAccessConfigUpdate);
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = object.codeId;
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        if (object.instantiatePermission !== undefined && object.instantiatePermission !== null) {
            message.instantiatePermission = types_1.AccessConfig.fromPartial(object.instantiatePermission);
        }
        else {
            message.instantiatePermission = undefined;
        }
        return message;
    },
};
const baseUpdateInstantiateConfigProposal = { title: "", description: "" };
exports.UpdateInstantiateConfigProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        for (const v of message.accessConfigUpdates) {
            exports.AccessConfigUpdate.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseUpdateInstantiateConfigProposal);
        message.accessConfigUpdates = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    message.accessConfigUpdates.push(exports.AccessConfigUpdate.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseUpdateInstantiateConfigProposal);
        message.accessConfigUpdates = [];
        if (object.title !== undefined && object.title !== null) {
            message.title = String(object.title);
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = String(object.description);
        }
        else {
            message.description = "";
        }
        if (object.accessConfigUpdates !== undefined && object.accessConfigUpdates !== null) {
            for (const e of object.accessConfigUpdates) {
                message.accessConfigUpdates.push(exports.AccessConfigUpdate.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined && (obj.description = message.description);
        if (message.accessConfigUpdates) {
            obj.accessConfigUpdates = message.accessConfigUpdates.map((e) => e ? exports.AccessConfigUpdate.toJSON(e) : undefined);
        }
        else {
            obj.accessConfigUpdates = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseUpdateInstantiateConfigProposal);
        message.accessConfigUpdates = [];
        if (object.title !== undefined && object.title !== null) {
            message.title = object.title;
        }
        else {
            message.title = "";
        }
        if (object.description !== undefined && object.description !== null) {
            message.description = object.description;
        }
        else {
            message.description = "";
        }
        if (object.accessConfigUpdates !== undefined && object.accessConfigUpdates !== null) {
            for (const e of object.accessConfigUpdates) {
                message.accessConfigUpdates.push(exports.AccessConfigUpdate.fromPartial(e));
            }
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
//# sourceMappingURL=proposal.js.map