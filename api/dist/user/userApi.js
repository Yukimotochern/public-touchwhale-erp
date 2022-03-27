"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteWorker = exports.UpdateWorker = exports.CreateWorker = exports.GetWorker = exports.GetWorkers = exports.ResetPassword = exports.ForgetPassword = exports.ChangePassword = exports.GetAvatarUploadUrl = exports.GetUser = exports.Update = exports.SignIn = exports.Verify = exports.SignUp = exports.plainUserSchema = void 0;
const api_1 = require("../api");
const mongoTypes_1 = require("../utils/mongoTypes");
const permissionTypes_1 = require("../permissionTypes");
const submitEmailSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
    },
    required: ['email'],
    additionalProperties: false,
};
const permissionFields = {
    role: { type: 'string', nullable: true },
    permission_groups: {
        type: 'array',
        items: {
            type: 'string',
            enum: permissionTypes_1.permissionGroupNameSet,
        },
        nullable: true,
    },
    role_type: {
        type: 'string',
        enum: ['default', 'custom'],
        nullable: true,
    },
};
exports.plainUserSchema = {
    type: 'object',
    properties: {
        ...mongoTypes_1.MongooseStaticsJSONSchema,
        ...mongoTypes_1.MongooseStampsJSONSchema,
        isOwner: { type: 'boolean' },
        owner: { type: 'string', nullable: true },
        isActive: { type: 'boolean' },
        provider: { type: 'string', enum: ['Google', 'TouchWhale'] },
        email: { type: 'string', nullable: true, format: 'email' },
        login_name: { type: 'string', nullable: true },
        username: { type: 'string', nullable: true },
        company: { type: 'string', nullable: true },
        avatar: { type: 'string', nullable: true },
        ...permissionFields,
    },
    required: ['isOwner', 'isActive', 'provider', 'createdAt', 'updatedAt'],
    additionalProperties: false,
};
var SignUp;
(function (SignUp) {
    SignUp.API = new api_1.api({
        bodySchema: submitEmailSchema,
    });
})(SignUp = exports.SignUp || (exports.SignUp = {}));
var Verify;
(function (Verify) {
    // api
    Verify.API = new api_1.api({
        bodySchema: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
            },
            required: ['email', 'password'],
            additionalProperties: false,
        },
        dataSchema: { type: 'string' },
    });
})(Verify = exports.Verify || (exports.Verify = {}));
var SignIn;
(function (SignIn) {
    SignIn.API = new api_1.api({
        bodySchema: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email', nullable: true },
                login_name: { type: 'string', format: 'email', nullable: true },
                password: { type: 'string' },
            },
            required: ['password'],
            additionalProperties: false,
        },
    });
})(SignIn = exports.SignIn || (exports.SignIn = {}));
var Update;
(function (Update) {
    Update.API = new api_1.api({
        bodySchema: {
            type: 'object',
            properties: {
                username: { type: 'string', nullable: true },
                company: { type: 'string', nullable: true },
                avatar: { type: 'string', nullable: true },
            },
            required: [],
            additionalProperties: false,
        },
        dataSchema: exports.plainUserSchema,
    });
})(Update = exports.Update || (exports.Update = {}));
var GetUser;
(function (GetUser) {
    GetUser.API = new api_1.api({
        dataSchema: exports.plainUserSchema,
    });
})(GetUser = exports.GetUser || (exports.GetUser = {}));
var GetAvatarUploadUrl;
(function (GetAvatarUploadUrl) {
    GetAvatarUploadUrl.API = new api_1.api({
        dataSchema: {
            type: 'object',
            properties: {
                avatar: { type: 'string' },
                uploadUrl: { type: 'string' },
            },
            required: ['avatar', 'uploadUrl'],
            additionalProperties: false,
        },
    });
})(GetAvatarUploadUrl = exports.GetAvatarUploadUrl || (exports.GetAvatarUploadUrl = {}));
var ChangePassword;
(function (ChangePassword) {
    ChangePassword.API = new api_1.api({
        bodySchema: {
            type: 'object',
            properties: {
                currentPassword: { type: 'string', nullable: true },
                newPassword: { type: 'string' },
                token: { type: 'string', nullable: true },
            },
            required: ['newPassword'],
            additionalProperties: false,
        },
    });
})(ChangePassword = exports.ChangePassword || (exports.ChangePassword = {}));
var ForgetPassword;
(function (ForgetPassword) {
    ForgetPassword.API = new api_1.api({
        bodySchema: submitEmailSchema,
    });
})(ForgetPassword = exports.ForgetPassword || (exports.ForgetPassword = {}));
var ResetPassword;
(function (ResetPassword) {
    ResetPassword.API = new api_1.api({
        bodySchema: {
            type: 'object',
            properties: {
                token: { type: 'string' },
                password: { type: 'string', nullable: true },
            },
            required: ['token'],
            additionalProperties: false,
        },
        dataSchema: {
            type: 'object',
            properties: {
                token: { type: 'string', nullable: true },
            },
        },
    });
})(ResetPassword = exports.ResetPassword || (exports.ResetPassword = {}));
var GetWorkers;
(function (GetWorkers) {
    GetWorkers.API = new api_1.api({
        dataSchema: {
            type: 'array',
            items: exports.plainUserSchema,
        },
    });
})(GetWorkers = exports.GetWorkers || (exports.GetWorkers = {}));
var GetWorker;
(function (GetWorker) {
    GetWorker.API = new api_1.api({
        dataSchema: exports.plainUserSchema,
    });
})(GetWorker = exports.GetWorker || (exports.GetWorker = {}));
var CreateWorker;
(function (CreateWorker) {
    CreateWorker.API = new api_1.api({
        bodySchema: {
            type: 'object',
            properties: {
                login_name: { type: 'string' },
                password: { type: 'string' },
                ...permissionFields,
            },
            required: ['login_name', 'password', 'role_type', 'permission_groups'],
            additionalProperties: false,
        },
        dataSchema: exports.plainUserSchema,
    });
})(CreateWorker = exports.CreateWorker || (exports.CreateWorker = {}));
var UpdateWorker;
(function (UpdateWorker) {
    UpdateWorker.API = new api_1.api({
        bodySchema: {
            type: 'object',
            properties: {
                password: { type: 'string', nullable: true },
                ...permissionFields,
            },
            additionalProperties: false,
        },
        dataSchema: exports.plainUserSchema,
    });
})(UpdateWorker = exports.UpdateWorker || (exports.UpdateWorker = {}));
var DeleteWorker;
(function (DeleteWorker) {
    DeleteWorker.API = new api_1.api({
        dataSchema: exports.plainUserSchema,
    });
})(DeleteWorker = exports.DeleteWorker || (exports.DeleteWorker = {}));
