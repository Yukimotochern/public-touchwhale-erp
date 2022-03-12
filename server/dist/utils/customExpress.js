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
exports.resBodyValidator = exports.bodyWithOutDataJSONSchemaType = exports.checkResponseWithDataCreator = exports.send = exports.sendDataCreator = void 0;
var ajv_1 = __importDefault(require("./ajv"));
var errorResponse_1 = __importDefault(require("./errorResponse"));
// send data function creator
function sendDataCreator(validator) {
    return function (res, data, extra, statusCode) {
        if (extra === void 0) { extra = {}; }
        if (statusCode === void 0) { statusCode = 200; }
        var resBody = __assign({ data: data }, extra);
        if (process.env.NODE_ENV === 'development') {
            if ((0, exports.resBodyValidator)(resBody)) {
                if (validator) {
                    // JSON.parce(JSON.stringfy(data)) is problematic for performance and will not be performed in production environment
                    var clientObtainedThing = JSON.parse(JSON.stringify(data));
                    if (!validator(clientObtainedThing)) {
                        console.log(clientObtainedThing);
                        console.log(validator.errors);
                        throw new errorResponse_1.default('Unexpected response body from server.');
                    }
                }
            }
            else {
                throw new errorResponse_1.default('Unexpected response from server.');
            }
        }
        return res.status(statusCode).json(resBody);
    };
}
exports.sendDataCreator = sendDataCreator;
function send(res, statusCode, extra) {
    if (statusCode === void 0) { statusCode = 200; }
    if (extra === void 0) { extra = {}; }
    res.status(statusCode).json(extra);
}
exports.send = send;
// response validator
function checkResponseWithDataCreator(validator) {
    return function (body) {
        return (0, exports.resBodyValidator)(body) && validator(body.data);
    };
}
exports.checkResponseWithDataCreator = checkResponseWithDataCreator;
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
