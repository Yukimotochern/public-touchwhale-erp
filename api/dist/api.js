"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const apiTypes_1 = require("./apiTypes");
const ajv_1 = __importDefault(require("./utils/ajv"));
const axios_1 = __importDefault(require("axios"));
const ApiPromise_1 = require("./utils/ApiPromise");
const CustomError_1 = __importStar(require("./utils/CustomError"));
const serialize_error_1 = require("serialize-error");
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
        this.onUnAuthoried = undefined;
        this.onNetworkError = undefined;
        this.onUnknownError = undefined;
        /**
         * * Server Things
         * TODO: 1. send
         * TODO: 2. sendData
         */
        /**
         * * Client Things
         */
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
    async request(url, method, data, abortController, cof = {}) {
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
            return this._resolve(res.data.data);
        }
        catch (err) {
            let innerError = new CustomError_1.ApiErrorDealtInternallyAndThrown(err);
            innerError = this.errorProcessor(innerError);
            return this._reject(innerError);
        }
    }
    errorProcessor(innerError) {
        let err = innerError.thrown;
        if (err instanceof CustomError_1.AjvErrors) {
            // validate problem
            console.log('Ajv errors:');
            console.log(err.message);
            console.log('with the following fields,');
            console.log(err.ajvError);
        }
        else if (axios_1.default.isAxiosError(err)) {
            // server error
            if (err.response?.data) {
                if (err.response.status === 401) {
                    /**
                     * Unauthorized, redirect if possible
                     * Also, cancel the request.
                     */
                    if (this.onUnAuthoried) {
                        this.onUnAuthoried();
                    }
                    innerError.thrown = new axios_1.default.Cancel('Unauthorized.');
                    return innerError;
                }
                else {
                    // deserialize error if possible
                    const deserializedError = (0, serialize_error_1.deserializeError)(err.response.data);
                    err = err.response.data;
                    innerError.deserializedError = deserializedError;
                    // mongoose error
                    // mongoDB error
                    // custom error from server
                    console.log('The following error thrown from server,');
                    console.error(deserializedError);
                    console.log('with the following data,');
                    console.log(err.response.data);
                    console.log(`Your may catch it by name of ${deserializedError.name} and message of ${deserializedError.message}.`);
                }
            }
            else {
                // some intrinsic error
                if (err instanceof Error && err.message === 'Network Error') {
                    // nework problem
                    if (this.onNetworkError) {
                        this.onNetworkError();
                    }
                }
                else {
                    // unexpected error
                    if (this.onUnknownError) {
                        this.onUnknownError();
                    }
                    console.log('Receive error from axios but without any response data. This might be some unexpected server internal error or axios error.');
                    console.log(err);
                    console.error(err);
                    console.log(`with typeof ${typeof err}.`);
                    console.log(`Isinstance of Error: ${err instanceof Error}.`);
                    console.log(`Isinstance of CustomError: ${err instanceof CustomError_1.default}.`);
                }
            }
        }
        else if (err instanceof axios_1.default.Cancel) {
            // cancel error
            console.log('Api call canceled.');
        }
        else {
            // Unknown Problem
            console.log('Unknown error of thing thrown, which is neither ajv error nor axios error,');
            console.log(err);
            console.error(err);
            console.log(`with typeof ${typeof err}.`);
            console.log(`Isinstance of Error: ${err instanceof Error}.`);
            console.log(`Isinstance of CustomError: ${err instanceof CustomError_1.default}.`);
            if (this.onUnknownError) {
                this.onUnknownError();
            }
        }
        innerError.thrown = err;
        return innerError;
    }
    // The belows are merely sugar, they may be SWEET~
    async get(url, abortController, cof = {}) {
        return this.request(url, 'GET', undefined, abortController, cof);
    }
    async post(url, data, abortController, cof = {}) {
        return this.request(url, 'POST', data, abortController, cof);
    }
    async put(url, data, abortController, cof = {}) {
        return this.request(url, 'PUT', data, abortController, cof);
    }
    async delete(url, data, abortController, cof = {}) {
        return this.request(url, 'DELETE', data, abortController, cof);
    }
}
exports.default = api;
exports.api = api;
