"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetpassword_validate = exports.forgetpassword_validate = exports.changepassword_validate = exports.updateuser_validate = exports.signup_validate = exports.signin_validate = void 0;
var ajv_instance_1 = __importDefault(require("../ajv-instance"));
var signup_schema = {
    type: 'object',
    properties: {
        company_name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        avatar: { type: 'string' },
    },
    required: ['email', 'password'],
    additionalProperties: false,
};
var signup_validate = ajv_instance_1.default.compile(signup_schema);
exports.signup_validate = signup_validate;
var signin_schema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
    },
    required: ['email', 'password'],
    additionalProperties: false,
};
var signin_validate = ajv_instance_1.default.compile(signin_schema);
exports.signin_validate = signin_validate;
var updateuser_schema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        company_name: { type: 'string' },
    },
    required: [],
    additionalProperties: false,
};
var updateuser_validate = ajv_instance_1.default.compile(updateuser_schema);
exports.updateuser_validate = updateuser_validate;
var changepassword_schema = {
    type: 'object',
    properties: {
        currentPassword: { type: 'string' },
        newPassword: { type: 'string' },
    },
    required: ['currentPassword', 'newPassword'],
    additionalProperties: false,
};
var changepassword_validate = ajv_instance_1.default.compile(changepassword_schema);
exports.changepassword_validate = changepassword_validate;
var forgetpassword_schema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
    },
    required: ['email'],
    additionalProperties: false,
};
var forgetpassword_validate = ajv_instance_1.default.compile(forgetpassword_schema);
exports.forgetpassword_validate = forgetpassword_validate;
var resetpassword_schema = {
    type: 'object',
    properties: {
        password: { type: 'string' },
    },
    required: ['password'],
    additionalProperties: false,
};
var resetpassword_validate = ajv_instance_1.default.compile(resetpassword_schema);
exports.resetpassword_validate = resetpassword_validate;
