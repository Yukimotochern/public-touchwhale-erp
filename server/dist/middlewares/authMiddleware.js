"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var ajv_1 = __importDefault(require("../utils/ajv"));
var errorResponse_1 = __importDefault(require("../utils/errorResponse"));
var tokenSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        iat: { type: 'number' },
        exp: { type: 'number' },
        isOwner: { type: 'boolean' },
        owner: { type: 'string' },
    },
    required: ['id', 'iat', 'exp', 'isOwner', 'owner'],
    additionalProperties: true,
};
var tokenValidator = ajv_1.default.compile(tokenSchema);
var authMiddleware = function (req, res, next) {
    var token = req.body.token;
    if (!token) {
        token = req.cookies.token;
    }
    if (!token) {
        return next(new errorResponse_1.default('No token, authorization denied.', 401));
    }
    try {
        var decode = jsonwebtoken_1.default.verify(token, process.env.JWTSECRET);
        if (tokenValidator(decode)) {
            req.userJWT = decode;
            // used to check owner when sending data
            res.owner = decode.owner;
            return next();
        }
        else {
            return next(new errorResponse_1.default('Token is invalid.', 401));
        }
    }
    catch (err) {
        console.log('Token is invalid.');
        return next(new errorResponse_1.default('Token is invalid.', 401, err));
    }
};
exports.default = authMiddleware;
