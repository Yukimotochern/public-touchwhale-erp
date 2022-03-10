"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resBodyValidator = exports.bodyWithOutDataJSONSchemaType = exports.checkBodyData = exports.sendData = void 0;
var ajv_1 = __importDefault(require("../utils/ajv"));
var errorResponse_1 = __importDefault(require("./errorResponse"));
// send response validator
function sendData(res, data, validator, extraBody, statusCode) {
    if (extraBody === void 0) { extraBody = {}; }
    if (statusCode === void 0) { statusCode = 200; }
    var resBody = __assign({ data: data }, extraBody);
    if (process.env.NODE_ENV === 'development') {
        if ((0, exports.resBodyValidator)(resBody)) {
            if (validator) {
                if (!validator(data)) {
                    throw new errorResponse_1.default('Unexpected response body from server.');
                }
            }
        }
        else {
            throw new errorResponse_1.default('Unexpected response from server.');
        }
    }
    return res.status(statusCode).json(resBody);
}
exports.sendData = sendData;
// response validator
function checkBodyData(body) {
    if ((0, exports.resBodyValidator)(body)) {
        if ()
            ;
    }
    return false;
}
exports.checkBodyData = checkBodyData;
// only for type check purpose, since any type in 'data' field is not representable by JSONSchemaType
exports.bodyWithOutDataJSONSchemaType = {
    type: 'object',
    properties: {
        message: { type: 'string', nullable: true },
        // if any thing should be added here, do add it in resBodyValidator (below) !!!!!
    },
    additionalProperties: false,
};
// general response body json validator
exports.resBodyValidator = ajv_1.default.compile({
    type: 'object',
    properties: {
        message: { type: 'string', nullable: true },
        data: {},
    },
    additionalProperties: false,
});
