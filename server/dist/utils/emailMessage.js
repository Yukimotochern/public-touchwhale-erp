"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sixDigitsMessage = exports.forgetPasswordMessage = void 0;
const forgetPasswordMessage = (option) => {
    const { protocol, host, token } = option;
    const resetUrl = process.env.NODE_ENV === 'production'
        ? `${protocol}://${host}/forgetpassword#${token}`
        : `${process.env.FRONTEND_DEV_URL}/forgetpassword#${token}`;
    const message = `Click the following link to reset password: \n ${resetUrl}`;
    return message;
};
exports.forgetPasswordMessage = forgetPasswordMessage;
const sixDigitsMessage = (option) => {
    const { sixDigits } = option;
    const message = `Your six digits number are: ${sixDigits}`;
    return message;
};
exports.sixDigitsMessage = sixDigitsMessage;
