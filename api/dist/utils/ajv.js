"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avjErrorWrapper = exports.ajv = void 0;
const ajv_1 = __importDefault(require("ajv"));
const CustomError_1 = __importDefault(require("./CustomError"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
exports.ajv = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(exports.ajv);
const avjErrorWrapper = (err) => new CustomError_1.default('Invalid data provided', 400, err);
exports.avjErrorWrapper = avjErrorWrapper;
exports.default = exports.ajv;
