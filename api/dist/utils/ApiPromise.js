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
exports.ApiPromise = void 0;
const axios_1 = __importDefault(require("axios"));
const CustomError_1 = __importStar(require("./CustomError"));
/**
 * A promise that can catch errors with type-safe method.
 */
class ApiPromise {
    constructor(executor) {
        this.promise = new Promise(executor);
    }
    get [Symbol.toStringTag]() {
        return 'ApiPromise';
    }
    then(onfulfilled, onrejected) {
        return this.promise.then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        const clonedPromise = this.promise.then();
        this.promise.catch(onrejected);
        this.promise = clonedPromise;
        return this;
    }
    finally(onfinally) {
        return this.promise.finally(onfinally);
    }
    getApiErrorDealtInternallyAndThrown() {
        let apiError = undefined;
        let err1 = undefined;
        this.catch((err) => {
            if (err instanceof CustomError_1.ApiErrorDealtInternallyAndThrown) {
                apiError = err;
            }
            else {
                err1 = err;
            }
            return this.promise.then();
        });
        if (apiError) {
            return apiError;
        }
        else {
            throw new CustomError_1.default('Api error is not properly set to ApiPromise as expected.', 500, err1);
        }
    }
    onEveryErrorButCancelAndAuth(onrejected) {
        const innerError = this.getApiErrorDealtInternallyAndThrown();
        let thrown = innerError.thrown;
        if (
        // cancel
        !(thrown instanceof axios_1.default.Cancel) &&
            // unauthorized
            !(axios_1.default.isAxiosError(thrown) && thrown.response?.status === 401)) {
            onrejected();
        }
        return this;
    }
    onEveryErrorButCancel(onrejected) {
        const innerError = this.getApiErrorDealtInternallyAndThrown();
        let thrown = innerError.thrown;
        if (
        // cancel
        !(thrown instanceof axios_1.default.Cancel)) {
            onrejected();
        }
        return this;
    }
}
exports.ApiPromise = ApiPromise;
exports.default = ApiPromise;
