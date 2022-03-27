"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPromise = void 0;
const axios_1 = __importDefault(require("axios"));
const CustomError_1 = require("./CustomError");
/**
 * A promise that can catch errors with type-safe method.
 */
Promise;
class ApiPromise extends Promise {
    constructor() {
        super(...arguments);
        this.catched = false;
    }
    onErrorsButCancelAndAuth(onrejected, executeWhenAlreadyCatched = false) {
        this.catch((err) => {
            if (err instanceof CustomError_1.ApiErrorDealtInternallyAndThrown &&
                (!this.catched || executeWhenAlreadyCatched)) {
                const thrown = err.thrown;
                if (
                // cancel
                !(thrown instanceof axios_1.default.Cancel) &&
                    // unauthorized
                    !(axios_1.default.isAxiosError(thrown) && thrown.response?.status === 401)) {
                    onrejected();
                    this.catched = true;
                }
            }
        });
        return this;
    }
    onErrorsButCancel(onrejected, executeWhenAlreadyCatched = false) {
        this.catch((err) => {
            if (err instanceof CustomError_1.ApiErrorDealtInternallyAndThrown &&
                (!this.catched || executeWhenAlreadyCatched)) {
                const thrown = err.thrown;
                if (
                // cancel
                !(thrown instanceof axios_1.default.Cancel)) {
                    onrejected();
                    this.catched = true;
                }
            }
        });
        return this;
    }
    onCustomCode(code, onrejected, executeWhenAlreadyCatched = false) {
        this.catch((err) => {
            if (err instanceof CustomError_1.ApiErrorDealtInternallyAndThrown &&
                (!this.catched || executeWhenAlreadyCatched)) {
                const custom = err.customError;
                if (custom && custom.statusCode === code) {
                    onrejected();
                    this.catched = true;
                }
            }
        });
        return this;
    }
}
exports.ApiPromise = ApiPromise;
exports.default = ApiPromise;
