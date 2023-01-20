"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcWebImpl = exports.QueryPinnedCodesDesc = exports.QueryCodesDesc = exports.QueryCodeDesc = exports.QuerySmartContractStateDesc = exports.QueryRawContractStateDesc = exports.QueryAllContractStateDesc = exports.QueryContractsByCodeDesc = exports.QueryContractHistoryDesc = exports.QueryContractInfoDesc = exports.QueryDesc = exports.QueryClientImpl = exports.QueryPinnedCodesResponse = exports.QueryPinnedCodesRequest = exports.QueryCodesResponse = exports.QueryCodesRequest = exports.QueryCodeResponse = exports.CodeInfoResponse = exports.QueryCodeRequest = exports.QuerySmartContractStateResponse = exports.QuerySmartContractStateRequest = exports.QueryRawContractStateResponse = exports.QueryRawContractStateRequest = exports.QueryAllContractStateResponse = exports.QueryAllContractStateRequest = exports.QueryContractsByCodeResponse = exports.QueryContractsByCodeRequest = exports.QueryContractHistoryResponse = exports.QueryContractHistoryRequest = exports.QueryContractInfoResponse = exports.QueryContractInfoRequest = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const grpc_web_1 = require("@improbable-eng/grpc-web");
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const types_1 = require("../../../cosmwasm/wasm/v1/types");
const pagination_1 = require("../../../cosmos/base/query/v1beta1/pagination");
const browser_headers_1 = require("browser-headers");
exports.protobufPackage = "cosmwasm.wasm.v1";
const baseQueryContractInfoRequest = { address: "" };
exports.QueryContractInfoRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryContractInfoRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryContractInfoRequest);
        if (object.address !== undefined && object.address !== null) {
            message.address = String(object.address);
        }
        else {
            message.address = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryContractInfoRequest);
        if (object.address !== undefined && object.address !== null) {
            message.address = object.address;
        }
        else {
            message.address = "";
        }
        return message;
    },
};
const baseQueryContractInfoResponse = { address: "" };
exports.QueryContractInfoResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.contractInfo !== undefined) {
            types_1.ContractInfo.encode(message.contractInfo, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryContractInfoResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.contractInfo = types_1.ContractInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryContractInfoResponse);
        if (object.address !== undefined && object.address !== null) {
            message.address = String(object.address);
        }
        else {
            message.address = "";
        }
        if (object.contractInfo !== undefined && object.contractInfo !== null) {
            message.contractInfo = types_1.ContractInfo.fromJSON(object.contractInfo);
        }
        else {
            message.contractInfo = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        message.contractInfo !== undefined &&
            (obj.contractInfo = message.contractInfo ? types_1.ContractInfo.toJSON(message.contractInfo) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryContractInfoResponse);
        if (object.address !== undefined && object.address !== null) {
            message.address = object.address;
        }
        else {
            message.address = "";
        }
        if (object.contractInfo !== undefined && object.contractInfo !== null) {
            message.contractInfo = types_1.ContractInfo.fromPartial(object.contractInfo);
        }
        else {
            message.contractInfo = undefined;
        }
        return message;
    },
};
const baseQueryContractHistoryRequest = { address: "" };
exports.QueryContractHistoryRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryContractHistoryRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryContractHistoryRequest);
        if (object.address !== undefined && object.address !== null) {
            message.address = String(object.address);
        }
        else {
            message.address = "";
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryContractHistoryRequest);
        if (object.address !== undefined && object.address !== null) {
            message.address = object.address;
        }
        else {
            message.address = "";
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseQueryContractHistoryResponse = {};
exports.QueryContractHistoryResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.entries) {
            types_1.ContractCodeHistoryEntry.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryContractHistoryResponse);
        message.entries = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.entries.push(types_1.ContractCodeHistoryEntry.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryContractHistoryResponse);
        message.entries = [];
        if (object.entries !== undefined && object.entries !== null) {
            for (const e of object.entries) {
                message.entries.push(types_1.ContractCodeHistoryEntry.fromJSON(e));
            }
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.entries) {
            obj.entries = message.entries.map((e) => (e ? types_1.ContractCodeHistoryEntry.toJSON(e) : undefined));
        }
        else {
            obj.entries = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryContractHistoryResponse);
        message.entries = [];
        if (object.entries !== undefined && object.entries !== null) {
            for (const e of object.entries) {
                message.entries.push(types_1.ContractCodeHistoryEntry.fromPartial(e));
            }
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseQueryContractsByCodeRequest = { codeId: long_1.default.UZERO };
exports.QueryContractsByCodeRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.codeId.isZero()) {
            writer.uint32(8).uint64(message.codeId);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryContractsByCodeRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeId = reader.uint64();
                    break;
                case 2:
                    message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryContractsByCodeRequest);
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = long_1.default.fromString(object.codeId);
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.codeId !== undefined && (obj.codeId = (message.codeId || long_1.default.UZERO).toString());
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryContractsByCodeRequest);
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = object.codeId;
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseQueryContractsByCodeResponse = { contracts: "" };
exports.QueryContractsByCodeResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.contracts) {
            writer.uint32(10).string(v);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryContractsByCodeResponse);
        message.contracts = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.contracts.push(reader.string());
                    break;
                case 2:
                    message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryContractsByCodeResponse);
        message.contracts = [];
        if (object.contracts !== undefined && object.contracts !== null) {
            for (const e of object.contracts) {
                message.contracts.push(String(e));
            }
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.contracts) {
            obj.contracts = message.contracts.map((e) => e);
        }
        else {
            obj.contracts = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryContractsByCodeResponse);
        message.contracts = [];
        if (object.contracts !== undefined && object.contracts !== null) {
            for (const e of object.contracts) {
                message.contracts.push(e);
            }
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseQueryAllContractStateRequest = { address: "" };
exports.QueryAllContractStateRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryAllContractStateRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryAllContractStateRequest);
        if (object.address !== undefined && object.address !== null) {
            message.address = String(object.address);
        }
        else {
            message.address = "";
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryAllContractStateRequest);
        if (object.address !== undefined && object.address !== null) {
            message.address = object.address;
        }
        else {
            message.address = "";
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseQueryAllContractStateResponse = {};
exports.QueryAllContractStateResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.models) {
            types_1.Model.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryAllContractStateResponse);
        message.models = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.models.push(types_1.Model.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryAllContractStateResponse);
        message.models = [];
        if (object.models !== undefined && object.models !== null) {
            for (const e of object.models) {
                message.models.push(types_1.Model.fromJSON(e));
            }
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.models) {
            obj.models = message.models.map((e) => (e ? types_1.Model.toJSON(e) : undefined));
        }
        else {
            obj.models = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryAllContractStateResponse);
        message.models = [];
        if (object.models !== undefined && object.models !== null) {
            for (const e of object.models) {
                message.models.push(types_1.Model.fromPartial(e));
            }
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseQueryRawContractStateRequest = { address: "" };
exports.QueryRawContractStateRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.queryData.length !== 0) {
            writer.uint32(18).bytes(message.queryData);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryRawContractStateRequest);
        message.queryData = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.queryData = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryRawContractStateRequest);
        message.queryData = new Uint8Array();
        if (object.address !== undefined && object.address !== null) {
            message.address = String(object.address);
        }
        else {
            message.address = "";
        }
        if (object.queryData !== undefined && object.queryData !== null) {
            message.queryData = bytesFromBase64(object.queryData);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        message.queryData !== undefined &&
            (obj.queryData = base64FromBytes(message.queryData !== undefined ? message.queryData : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryRawContractStateRequest);
        if (object.address !== undefined && object.address !== null) {
            message.address = object.address;
        }
        else {
            message.address = "";
        }
        if (object.queryData !== undefined && object.queryData !== null) {
            message.queryData = object.queryData;
        }
        else {
            message.queryData = new Uint8Array();
        }
        return message;
    },
};
const baseQueryRawContractStateResponse = {};
exports.QueryRawContractStateResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.data.length !== 0) {
            writer.uint32(10).bytes(message.data);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryRawContractStateResponse);
        message.data = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryRawContractStateResponse);
        message.data = new Uint8Array();
        if (object.data !== undefined && object.data !== null) {
            message.data = bytesFromBase64(object.data);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryRawContractStateResponse);
        if (object.data !== undefined && object.data !== null) {
            message.data = object.data;
        }
        else {
            message.data = new Uint8Array();
        }
        return message;
    },
};
const baseQuerySmartContractStateRequest = { address: "" };
exports.QuerySmartContractStateRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.queryData.length !== 0) {
            writer.uint32(18).bytes(message.queryData);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQuerySmartContractStateRequest);
        message.queryData = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.queryData = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQuerySmartContractStateRequest);
        message.queryData = new Uint8Array();
        if (object.address !== undefined && object.address !== null) {
            message.address = String(object.address);
        }
        else {
            message.address = "";
        }
        if (object.queryData !== undefined && object.queryData !== null) {
            message.queryData = bytesFromBase64(object.queryData);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        message.queryData !== undefined &&
            (obj.queryData = base64FromBytes(message.queryData !== undefined ? message.queryData : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQuerySmartContractStateRequest);
        if (object.address !== undefined && object.address !== null) {
            message.address = object.address;
        }
        else {
            message.address = "";
        }
        if (object.queryData !== undefined && object.queryData !== null) {
            message.queryData = object.queryData;
        }
        else {
            message.queryData = new Uint8Array();
        }
        return message;
    },
};
const baseQuerySmartContractStateResponse = {};
exports.QuerySmartContractStateResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.data.length !== 0) {
            writer.uint32(10).bytes(message.data);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQuerySmartContractStateResponse);
        message.data = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQuerySmartContractStateResponse);
        message.data = new Uint8Array();
        if (object.data !== undefined && object.data !== null) {
            message.data = bytesFromBase64(object.data);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQuerySmartContractStateResponse);
        if (object.data !== undefined && object.data !== null) {
            message.data = object.data;
        }
        else {
            message.data = new Uint8Array();
        }
        return message;
    },
};
const baseQueryCodeRequest = { codeId: long_1.default.UZERO };
exports.QueryCodeRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.codeId.isZero()) {
            writer.uint32(8).uint64(message.codeId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryCodeRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeId = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryCodeRequest);
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = long_1.default.fromString(object.codeId);
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.codeId !== undefined && (obj.codeId = (message.codeId || long_1.default.UZERO).toString());
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryCodeRequest);
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = object.codeId;
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        return message;
    },
};
const baseCodeInfoResponse = { codeId: long_1.default.UZERO, creator: "" };
exports.CodeInfoResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.codeId.isZero()) {
            writer.uint32(8).uint64(message.codeId);
        }
        if (message.creator !== "") {
            writer.uint32(18).string(message.creator);
        }
        if (message.dataHash.length !== 0) {
            writer.uint32(26).bytes(message.dataHash);
        }
        if (message.instantiatePermission !== undefined) {
            types_1.AccessConfig.encode(message.instantiatePermission, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseCodeInfoResponse);
        message.dataHash = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeId = reader.uint64();
                    break;
                case 2:
                    message.creator = reader.string();
                    break;
                case 3:
                    message.dataHash = reader.bytes();
                    break;
                case 6:
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
        const message = Object.assign({}, baseCodeInfoResponse);
        message.dataHash = new Uint8Array();
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = long_1.default.fromString(object.codeId);
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = "";
        }
        if (object.dataHash !== undefined && object.dataHash !== null) {
            message.dataHash = bytesFromBase64(object.dataHash);
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
        message.creator !== undefined && (obj.creator = message.creator);
        message.dataHash !== undefined &&
            (obj.dataHash = base64FromBytes(message.dataHash !== undefined ? message.dataHash : new Uint8Array()));
        message.instantiatePermission !== undefined &&
            (obj.instantiatePermission = message.instantiatePermission
                ? types_1.AccessConfig.toJSON(message.instantiatePermission)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseCodeInfoResponse);
        if (object.codeId !== undefined && object.codeId !== null) {
            message.codeId = object.codeId;
        }
        else {
            message.codeId = long_1.default.UZERO;
        }
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = "";
        }
        if (object.dataHash !== undefined && object.dataHash !== null) {
            message.dataHash = object.dataHash;
        }
        else {
            message.dataHash = new Uint8Array();
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
const baseQueryCodeResponse = {};
exports.QueryCodeResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.codeInfo !== undefined) {
            exports.CodeInfoResponse.encode(message.codeInfo, writer.uint32(10).fork()).ldelim();
        }
        if (message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryCodeResponse);
        message.data = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeInfo = exports.CodeInfoResponse.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryCodeResponse);
        message.data = new Uint8Array();
        if (object.codeInfo !== undefined && object.codeInfo !== null) {
            message.codeInfo = exports.CodeInfoResponse.fromJSON(object.codeInfo);
        }
        else {
            message.codeInfo = undefined;
        }
        if (object.data !== undefined && object.data !== null) {
            message.data = bytesFromBase64(object.data);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.codeInfo !== undefined &&
            (obj.codeInfo = message.codeInfo ? exports.CodeInfoResponse.toJSON(message.codeInfo) : undefined);
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryCodeResponse);
        if (object.codeInfo !== undefined && object.codeInfo !== null) {
            message.codeInfo = exports.CodeInfoResponse.fromPartial(object.codeInfo);
        }
        else {
            message.codeInfo = undefined;
        }
        if (object.data !== undefined && object.data !== null) {
            message.data = object.data;
        }
        else {
            message.data = new Uint8Array();
        }
        return message;
    },
};
const baseQueryCodesRequest = {};
exports.QueryCodesRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pagination !== undefined) {
            pagination_1.PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryCodesRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryCodesRequest);
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryCodesRequest);
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseQueryCodesResponse = {};
exports.QueryCodesResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.codeInfos) {
            exports.CodeInfoResponse.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryCodesResponse);
        message.codeInfos = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeInfos.push(exports.CodeInfoResponse.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryCodesResponse);
        message.codeInfos = [];
        if (object.codeInfos !== undefined && object.codeInfos !== null) {
            for (const e of object.codeInfos) {
                message.codeInfos.push(exports.CodeInfoResponse.fromJSON(e));
            }
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.codeInfos) {
            obj.codeInfos = message.codeInfos.map((e) => (e ? exports.CodeInfoResponse.toJSON(e) : undefined));
        }
        else {
            obj.codeInfos = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryCodesResponse);
        message.codeInfos = [];
        if (object.codeInfos !== undefined && object.codeInfos !== null) {
            for (const e of object.codeInfos) {
                message.codeInfos.push(exports.CodeInfoResponse.fromPartial(e));
            }
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseQueryPinnedCodesRequest = {};
exports.QueryPinnedCodesRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pagination !== undefined) {
            pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryPinnedCodesRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryPinnedCodesRequest);
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? pagination_1.PageRequest.toJSON(message.pagination) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryPinnedCodesRequest);
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
const baseQueryPinnedCodesResponse = { codeIds: long_1.default.UZERO };
exports.QueryPinnedCodesResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        writer.uint32(10).fork();
        for (const v of message.codeIds) {
            writer.uint64(v);
        }
        writer.ldelim();
        if (message.pagination !== undefined) {
            pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryPinnedCodesResponse);
        message.codeIds = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
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
                case 2:
                    message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryPinnedCodesResponse);
        message.codeIds = [];
        if (object.codeIds !== undefined && object.codeIds !== null) {
            for (const e of object.codeIds) {
                message.codeIds.push(long_1.default.fromString(e));
            }
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.codeIds) {
            obj.codeIds = message.codeIds.map((e) => (e || long_1.default.UZERO).toString());
        }
        else {
            obj.codeIds = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? pagination_1.PageResponse.toJSON(message.pagination) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryPinnedCodesResponse);
        message.codeIds = [];
        if (object.codeIds !== undefined && object.codeIds !== null) {
            for (const e of object.codeIds) {
                message.codeIds.push(e);
            }
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
class QueryClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.ContractInfo = this.ContractInfo.bind(this);
        this.ContractHistory = this.ContractHistory.bind(this);
        this.ContractsByCode = this.ContractsByCode.bind(this);
        this.AllContractState = this.AllContractState.bind(this);
        this.RawContractState = this.RawContractState.bind(this);
        this.SmartContractState = this.SmartContractState.bind(this);
        this.Code = this.Code.bind(this);
        this.Codes = this.Codes.bind(this);
        this.PinnedCodes = this.PinnedCodes.bind(this);
    }
    ContractInfo(request, metadata) {
        return this.rpc.unary(exports.QueryContractInfoDesc, exports.QueryContractInfoRequest.fromPartial(request), metadata);
    }
    ContractHistory(request, metadata) {
        return this.rpc.unary(exports.QueryContractHistoryDesc, exports.QueryContractHistoryRequest.fromPartial(request), metadata);
    }
    ContractsByCode(request, metadata) {
        return this.rpc.unary(exports.QueryContractsByCodeDesc, exports.QueryContractsByCodeRequest.fromPartial(request), metadata);
    }
    AllContractState(request, metadata) {
        return this.rpc.unary(exports.QueryAllContractStateDesc, exports.QueryAllContractStateRequest.fromPartial(request), metadata);
    }
    RawContractState(request, metadata) {
        return this.rpc.unary(exports.QueryRawContractStateDesc, exports.QueryRawContractStateRequest.fromPartial(request), metadata);
    }
    SmartContractState(request, metadata) {
        return this.rpc.unary(exports.QuerySmartContractStateDesc, exports.QuerySmartContractStateRequest.fromPartial(request), metadata);
    }
    Code(request, metadata) {
        return this.rpc.unary(exports.QueryCodeDesc, exports.QueryCodeRequest.fromPartial(request), metadata);
    }
    Codes(request, metadata) {
        return this.rpc.unary(exports.QueryCodesDesc, exports.QueryCodesRequest.fromPartial(request), metadata);
    }
    PinnedCodes(request, metadata) {
        return this.rpc.unary(exports.QueryPinnedCodesDesc, exports.QueryPinnedCodesRequest.fromPartial(request), metadata);
    }
}
exports.QueryClientImpl = QueryClientImpl;
exports.QueryDesc = {
    serviceName: "cosmwasm.wasm.v1.Query",
};
exports.QueryContractInfoDesc = {
    methodName: "ContractInfo",
    service: exports.QueryDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.QueryContractInfoRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            return Object.assign(Object.assign({}, exports.QueryContractInfoResponse.decode(data)), { toObject() {
                    return this;
                } });
        },
    },
};
exports.QueryContractHistoryDesc = {
    methodName: "ContractHistory",
    service: exports.QueryDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.QueryContractHistoryRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            return Object.assign(Object.assign({}, exports.QueryContractHistoryResponse.decode(data)), { toObject() {
                    return this;
                } });
        },
    },
};
exports.QueryContractsByCodeDesc = {
    methodName: "ContractsByCode",
    service: exports.QueryDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.QueryContractsByCodeRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            return Object.assign(Object.assign({}, exports.QueryContractsByCodeResponse.decode(data)), { toObject() {
                    return this;
                } });
        },
    },
};
exports.QueryAllContractStateDesc = {
    methodName: "AllContractState",
    service: exports.QueryDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.QueryAllContractStateRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            return Object.assign(Object.assign({}, exports.QueryAllContractStateResponse.decode(data)), { toObject() {
                    return this;
                } });
        },
    },
};
exports.QueryRawContractStateDesc = {
    methodName: "RawContractState",
    service: exports.QueryDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.QueryRawContractStateRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            return Object.assign(Object.assign({}, exports.QueryRawContractStateResponse.decode(data)), { toObject() {
                    return this;
                } });
        },
    },
};
exports.QuerySmartContractStateDesc = {
    methodName: "SmartContractState",
    service: exports.QueryDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.QuerySmartContractStateRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            return Object.assign(Object.assign({}, exports.QuerySmartContractStateResponse.decode(data)), { toObject() {
                    return this;
                } });
        },
    },
};
exports.QueryCodeDesc = {
    methodName: "Code",
    service: exports.QueryDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.QueryCodeRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            return Object.assign(Object.assign({}, exports.QueryCodeResponse.decode(data)), { toObject() {
                    return this;
                } });
        },
    },
};
exports.QueryCodesDesc = {
    methodName: "Codes",
    service: exports.QueryDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.QueryCodesRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            return Object.assign(Object.assign({}, exports.QueryCodesResponse.decode(data)), { toObject() {
                    return this;
                } });
        },
    },
};
exports.QueryPinnedCodesDesc = {
    methodName: "PinnedCodes",
    service: exports.QueryDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.QueryPinnedCodesRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            return Object.assign(Object.assign({}, exports.QueryPinnedCodesResponse.decode(data)), { toObject() {
                    return this;
                } });
        },
    },
};
class GrpcWebImpl {
    constructor(host, options) {
        this.host = host;
        this.options = options;
    }
    unary(methodDesc, _request, metadata) {
        var _a;
        const request = Object.assign(Object.assign({}, _request), methodDesc.requestType);
        const maybeCombinedMetadata = metadata && this.options.metadata
            ? new browser_headers_1.BrowserHeaders(Object.assign(Object.assign({}, (_a = this.options) === null || _a === void 0 ? void 0 : _a.metadata.headersMap), metadata === null || metadata === void 0 ? void 0 : metadata.headersMap))
            : metadata || this.options.metadata;
        return new Promise((resolve, reject) => {
            grpc_web_1.grpc.unary(methodDesc, {
                request,
                host: this.host,
                metadata: maybeCombinedMetadata,
                transport: this.options.transport,
                debug: this.options.debug,
                onEnd: function (response) {
                    if (response.status === grpc_web_1.grpc.Code.OK) {
                        resolve(response.message);
                    }
                    else {
                        const err = new Error(response.statusMessage);
                        err.code = response.status;
                        err.metadata = response.trailers;
                        reject(err);
                    }
                },
            });
        });
    }
}
exports.GrpcWebImpl = GrpcWebImpl;
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
//# sourceMappingURL=query.js.map