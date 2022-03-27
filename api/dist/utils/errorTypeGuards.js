"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notApiError = exports.isErrorButApiError = void 0;
const CustomError_1 = require("./CustomError");
function isErrorButApiError(err) {
    return (!(err instanceof CustomError_1.ApiErrorDealtInternallyAndThrown) && err instanceof Error);
}
exports.isErrorButApiError = isErrorButApiError;
const notApiError = (err) => !(err instanceof CustomError_1.ApiErrorDealtInternallyAndThrown);
exports.notApiError = notApiError;
