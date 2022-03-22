"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const apiTypes_1 = require("./apiTypes");
const ajv_1 = __importDefault(require("./utils/ajv"));
const axios_1 = __importDefault(require("axios"));
const ApiPromise_1 = require("./utils/ApiPromise");
const CustomError_1 = require("./utils/CustomError");
const antd_1 = require("antd");
let config = {
    timeout: process.env.REACT_APP_API_TIMEOUT
        ? +process.env.REACT_APP_API_TIMEOUT
        : 999999999,
    baseURL: process.env.REACT_APP_URL || 'https://touchwhale-erp.com',
    headers: { 'content-type': 'application/json' },
};
class api {
    constructor({ bodySchema, dataSchema, }) {
        this.resWithAnyDataValidator = ajv_1.default.compile(apiTypes_1.responseBodyWithAnyDataJSONSchema);
        this._reject = (rejectedError) => new ApiPromise_1.ApiPromise((resolve, reject) => reject(rejectedError));
        this._resolve = (data) => new ApiPromise_1.ApiPromise((resolve, reject) => resolve(data));
        if (bodySchema) {
            this.bodyValidator = ajv_1.default.compile(bodySchema);
        }
        else {
            this.bodyValidator = ajv_1.default.compile({});
        }
        if (dataSchema) {
            this.dataValidator = ajv_1.default.compile(dataSchema);
            this.resValidator = ajv_1.default.compile({
                type: 'object',
                properties: {
                    message: { type: 'string', nullable: true },
                    data: dataSchema,
                },
                additionalProperties: false,
            });
        }
        else {
            this.dataValidator = ajv_1.default.compile({});
            this.resValidator = ajv_1.default.compile(apiTypes_1.responseBodyWithAnyDataJSONSchema);
        }
    }
    async request(url, method, data, abortController = undefined, cof = {}) {
        try {
            // validate request body data under developent mode
            if (process.env.NODE_ENV === 'development') {
                if (!this.bodyValidator(data)) {
                    console.log('Unexpected thing about to sent:');
                    console.log(data);
                    throw new CustomError_1.AjvErrors('Invalid request body sent.', this.bodyValidator.errors, 400);
                }
            }
            // make the actural request
            const res = await axios_1.default.request({
                url: `/api/v${process.env.REACT_APP_API_VERSION || 1}${url}`,
                method,
                data,
                ...config,
                ...cof,
                signal: abortController?.signal || undefined,
            });
            // validate response data
            if (!this.resValidator(res.data)) {
                console.log('Unexpected thing got:');
                console.log(res.data);
                throw new CustomError_1.AjvErrors('Invalid response from server received.', this.resValidator.errors, 500);
            }
            return this._resolve(res.data);
        }
        catch (err) {
            let innerError = new CustomError_1.ApiErrorDealtInternallyAndThrown(err);
            innerError = this.errorProcessor(innerError);
            return this._reject(innerError);
        }
    }
    errorProcessor(innerError) {
        let err = innerError.thrown;
        console.log(err);
        if (err instanceof CustomError_1.AjvErrors) {
            // validate problem
        }
        else if (axios_1.default.isAxiosError(err)) {
            // possibly server error
            if (err.response?.data) {
                // deserialize error if possible
                // mongoose error
                // mongoDB error
                // custom error from server
                console.log('here');
            }
            else {
                // unexpectedly nothing from server
                antd_1.message.error('Something seems to go wrong');
            }
        }
        else if (err instanceof DOMException) {
            // possibly Network Error
            console.log(err.NETWORK_ERR);
            console.log(err.name);
            if (err.name === '') {
            }
        }
        else if (err instanceof axios_1.default.Cancel) {
            // cancel error
        }
        else {
            // Unknown Problem
        }
        innerError.thrown = err;
        return innerError;
    }
    // Belows are merely sugar, they may be SWEET~
    async get(url, cof = {}, abortController = undefined) {
        return this.request(url, 'GET', undefined, abortController, cof);
    }
    async post(url, data, cof = {}, abortController = undefined) {
        return this.request(url, 'POST', data, abortController, cof);
    }
    async put(url, data, cof = {}, abortController = undefined) {
        return this.request(url, 'PUT', data, abortController, cof);
    }
    async delete(url, data, cof = {}, abortController = undefined) {
        return this.request(url, 'DELETE', data, abortController, cof);
    }
}
exports.default = api;
exports.api = api;
