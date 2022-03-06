"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordBodyValidator = exports.forgetPasswordBodyValidator = exports.changePasswordBodyValidator = exports.updateRegularUserEmailBodyValidator = exports.updateRegularUserBodyValidator = exports.signUpBodyValidator = exports.signInBodyValidator = void 0;
var ajv_1 = __importDefault(require("../../utils/ajv"));
// Bellow, the purpose of variable is more explicit. by Yuki
var signUpBodySchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
    },
    required: ['email'],
    additionalProperties: false,
};
var signUpBodyValidator = ajv_1.default.compile(signUpBodySchema);
exports.signUpBodyValidator = signUpBodyValidator;
var signInBodySchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
    },
    required: ['email', 'password'],
    additionalProperties: false,
};
var signInBodyValidator = ajv_1.default.compile(signInBodySchema);
exports.signInBodyValidator = signInBodyValidator;
var updateRegularUserBodySchema = {
    type: 'object',
    properties: {
        company_name: { type: 'string', nullable: true },
        username: { type: 'string', nullable: true },
    },
    required: [],
    additionalProperties: false,
};
var updateRegularUserBodyValidator = ajv_1.default.compile(updateRegularUserBodySchema);
exports.updateRegularUserBodyValidator = updateRegularUserBodyValidator;
var updateRegularUserEmailBodySchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
    },
    required: ['email'],
    additionalProperties: false,
};
var updateRegularUserEmailBodyValidator = ajv_1.default.compile(updateRegularUserEmailBodySchema);
exports.updateRegularUserEmailBodyValidator = updateRegularUserEmailBodyValidator;
var changePasswordBodySchema = {
    type: 'object',
    properties: {
        currentPassword: { type: 'string' },
        newPassword: { type: 'string' },
        token: { type: 'string', nullable: true },
    },
    required: ['newPassword'],
    additionalProperties: false,
};
var changePasswordBodyValidator = ajv_1.default.compile(changePasswordBodySchema);
exports.changePasswordBodyValidator = changePasswordBodyValidator;
var forgetPasswordBodySchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
    },
    required: ['email'],
    additionalProperties: false,
};
var forgetPasswordBodyValidator = ajv_1.default.compile(forgetPasswordBodySchema);
exports.forgetPasswordBodyValidator = forgetPasswordBodyValidator;
var resetPasswordBodySchema = {
    type: 'object',
    properties: {
        password: { type: 'string' },
    },
    required: ['password'],
    additionalProperties: false,
};
var resetPasswordBodyValidator = ajv_1.default.compile(resetPasswordBodySchema);
exports.resetPasswordBodyValidator = resetPasswordBodyValidator;
