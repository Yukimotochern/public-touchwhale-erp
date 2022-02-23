"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ajvInstance = void 0;
var ajv_1 = __importDefault(require("ajv"));
var ajv_formats_1 = __importDefault(require("ajv-formats"));
exports.ajvInstance = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(exports.ajvInstance);
exports.default = exports.ajvInstance;
