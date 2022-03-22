"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resBodyValidator = exports.HandlerIO = void 0;
const ajv_1 = __importDefault(require("../utils/ajv"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
class HandlerIO {
    // Request
    static bodyValidatorCreator(schema) {
        return ajv_1.default.compile(schema);
    }
    // Response
    // default data sender
    static send(res, statusCode = 200, extra = {}) {
        res.status(statusCode).json(extra);
    }
    // customized data sender
    static sendDataCreator(schema) {
        const validator = ajv_1.default.compile(schema);
        return function (res, data, extra = {}, statusCode = 200) {
            const resBody = {
                data,
                ...extra,
            };
            // do some computationally intensive checks in development mode
            if (process.env.NODE_ENV === 'development') {
                if ((0, exports.resBodyValidator)(resBody)) {
                    // JSON.parce(JSON.stringfy(data)) is problematic for performance and will not be performed in production environment
                    let clientObtainedThing = JSON.parse(JSON.stringify(data));
                    let ArrayWithOwner = [];
                    const isObjectWithOwner = (x) => typeof x === 'object' && typeof x.owner === 'string';
                    const isArrayWithOwner = (x) => x.every(isObjectWithOwner);
                    if (isObjectWithOwner(clientObtainedThing)) {
                        ArrayWithOwner.push(clientObtainedThing);
                    }
                    else if (Array.isArray(clientObtainedThing) &&
                        isArrayWithOwner(clientObtainedThing)) {
                        ArrayWithOwner = ArrayWithOwner.concat(clientObtainedThing);
                    }
                    if (ArrayWithOwner.length !== 0) {
                        if (!ArrayWithOwner.every((item) => item.owner === res.owner)) {
                            return new CustomError_1.default('Controller has returned something that is not owned by this user or the owner of this user.');
                        }
                    }
                    // check with provided validator
                    if (!validator(clientObtainedThing)) {
                        console.log(`Here's what client obtained: `);
                        console.log(clientObtainedThing);
                        console.log(`with the following errors:`);
                        console.log(validator.errors);
                        throw new CustomError_1.default('Unexpected response body from server.');
                    }
                }
                else {
                    throw new CustomError_1.default('Unexpected response from server.');
                }
            }
            return res.status(statusCode).json(resBody);
        };
    }
    // response validator
    static checkResponseWithDataCreator(validator) {
        return function (body) {
            return (0, exports.resBodyValidator)(body) && validator(body.data);
        };
    }
}
exports.HandlerIO = HandlerIO;
// general response body json validator
exports.resBodyValidator = ajv_1.default.compile({
    type: 'object',
    properties: {
        message: { type: 'string', nullable: true },
        data: {},
    },
    additionalProperties: false,
});
