"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var errorResponse_1 = __importDefault(require("../utils/errorResponse"));
var authMiddleware = function (req, res, next) {
    var token = req.cookies.token;
    if (!token) {
        token = req.body.token;
    }
    if (!token) {
        return next(new errorResponse_1.default('No token, authorization denied.', 401));
    }
    try {
        var decode = jsonwebtoken_1.default.verify(token, process.env.JWTSECRET);
        req.userJWT = decode;
        next();
    }
    catch (err) {
        return next(new errorResponse_1.default('Token is invalid.', 401));
    }
};
exports.default = authMiddleware;
