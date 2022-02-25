"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var authMiddleware = function (req, res, next) {
    var token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied.' });
    }
    // console.log(token)
    try {
        var decode = jsonwebtoken_1.default.verify(token, process.env.JWTSECRET);
        req.user = decode;
        next();
    }
    catch (err) {
        res.status(400).json({ error: 'Token is invalid.' });
    }
};
exports.default = authMiddleware;
