"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avjErrorWrapper = exports.ajvInstance = void 0;
var ajv_1 = __importDefault(require("ajv"));
var ajv_formats_1 = __importDefault(require("ajv-formats"));
var errorResponse_1 = __importDefault(require("./errorResponse"));
exports.ajvInstance = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(exports.ajvInstance);
var avjErrorWrapper = function (err) { return new errorResponse_1.default('Invalid data provided', 400, err); };
exports.avjErrorWrapper = avjErrorWrapper;
exports.default = exports.ajvInstance;
