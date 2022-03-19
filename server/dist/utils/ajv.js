"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avjErrorWrapper = exports.ajvInstance = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const CustomError_1 = __importDefault(require("./CustomError"));
exports.ajvInstance = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(exports.ajvInstance);
const avjErrorWrapper = (err) => new CustomError_1.default('Invalid data provided', 400, err);
exports.avjErrorWrapper = avjErrorWrapper;
exports.default = exports.ajvInstance;
