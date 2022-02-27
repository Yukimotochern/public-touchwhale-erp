"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sixDigitsMessage = exports.forgetPasswordMessage = void 0;
var forgetPasswordMessage = function (option) {
    var protocol = option.protocol, host = option.host, token = option.token;
    var resetUrl = "".concat(protocol, "://").concat(host, "/api/v1/user/forgetpassword/").concat(token);
    var message = "Make a PUT request to: \n ".concat(resetUrl);
    return message;
};
exports.forgetPasswordMessage = forgetPasswordMessage;
var sixDigitsMessage = function (option) {
    var sixDigits = option.sixDigits;
    var message = "Your six digits number are: ".concat(sixDigits);
    return message;
};
exports.sixDigitsMessage = sixDigitsMessage;
