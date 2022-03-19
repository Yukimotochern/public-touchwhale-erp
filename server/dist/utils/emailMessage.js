"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sixDigitsMessage = exports.forgetPasswordMessage = void 0;
const forgetPasswordMessage = (option) => {
    const { protocol, host, token } = option;
    const resetUrl = `${protocol}://${host}/api/v1/user/forgetpassword/${token}`;
    const message = `Make a PUT request to: \n ${resetUrl}`;
    return message;
};
exports.forgetPasswordMessage = forgetPasswordMessage;
const sixDigitsMessage = (option) => {
    const { sixDigits } = option;
    const message = `Your six digits number are: ${sixDigits}`;
    return message;
};
exports.sixDigitsMessage = sixDigitsMessage;
