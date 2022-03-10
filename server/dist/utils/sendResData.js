"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResData = void 0;
function sendResData(res, statusCode, body, validator) {
    if (statusCode === void 0) { statusCode = 200; }
    if (body === void 0) { body = undefined; }
    switch (process.env.NODE_ENV) {
        case 'production':
            // direct send
            break;
        case 'development':
        default:
            // validate and send
            res.status(statusCode).json(body);
    }
}
exports.sendResData = sendResData;
