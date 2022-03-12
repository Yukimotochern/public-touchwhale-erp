"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
var ajv_1 = __importDefault(require("../../utils/ajv"));
var customExpress_1 = require("../../utils/customExpress");
var mongodb_1 = require("../../utils/mongodb");
var UserValidator;
(function (UserValidator) {
    // Template
    /*
     export namespace XXX {
      const bodySchema: JSONSchemaType<UserType.XXXBody> = {
        type: 'object',
        properties: {
        },
        required: [],
        additionalProperties: false,
      }
      export const body = ajv.compile(bodySchema)
      const dataSchema: JSONSchemaType<UserType.XXXData> = { type: '' }
      const data = ajv.compile(dataSchema)
      export const sendData = sendDataCreator<UserType.XXXData>(data)
    }
    */
    var plainUserSchema = {
        type: 'object',
        properties: __assign(__assign({}, mongodb_1.MongooseStaticsJSONSchema), { isOwner: { type: 'boolean' }, isActive: { type: 'boolean' }, provider: { type: 'string', enum: ['Google', 'TouchWhale'] }, email: { type: 'string', nullable: true }, login_name: { type: 'string', nullable: true }, username: { type: 'string', nullable: true }, company: { type: 'string', nullable: true }, avatar: { type: 'string', nullable: true }, createdAt: {
                anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
            }, updatedAt: {
                anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
            } }),
        required: ['isOwner', 'isActive', 'provider', 'createdAt', 'updatedAt'],
        additionalProperties: false,
    };
    var submitEmailSchema = {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },
        },
        required: ['email'],
        additionalProperties: false,
    };
    var SignUp;
    (function (SignUp) {
        SignUp.body = ajv_1.default.compile(submitEmailSchema);
        SignUp.sendData = (0, customExpress_1.sendDataCreator)(SignUp.body);
    })(SignUp = UserValidator.SignUp || (UserValidator.SignUp = {}));
    var Verify;
    (function (Verify) {
        // body to accept
        var bodySchema = {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
            },
            required: ['email', 'password'],
            additionalProperties: false,
        };
        Verify.body = ajv_1.default.compile(bodySchema);
        // data to send back
        var dataSchema = { type: 'string' };
        var data = ajv_1.default.compile(dataSchema);
        Verify.sendData = (0, customExpress_1.sendDataCreator)(data);
    })(Verify = UserValidator.Verify || (UserValidator.Verify = {}));
    var SignIn;
    (function (SignIn) {
        var bodySchema = {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email', nullable: true },
                login_name: { type: 'string', format: 'email', nullable: true },
                password: { type: 'string' },
            },
            required: ['password'],
            additionalProperties: false,
        };
        SignIn.body = ajv_1.default.compile(bodySchema);
    })(SignIn = UserValidator.SignIn || (UserValidator.SignIn = {}));
    var GetUser;
    (function (GetUser) {
        var data = ajv_1.default.compile(plainUserSchema);
        GetUser.sendData = (0, customExpress_1.sendDataCreator)(data);
    })(GetUser = UserValidator.GetUser || (UserValidator.GetUser = {}));
    var Update;
    (function (Update) {
        var bodySchema = {
            type: 'object',
            properties: {
                username: { type: 'string', nullable: true },
                company: { type: 'string', nullable: true },
                avatar: { type: 'string', nullable: true },
            },
            required: [],
            additionalProperties: false,
        };
        Update.body = ajv_1.default.compile(bodySchema);
        var data = ajv_1.default.compile(plainUserSchema);
        Update.sendData = (0, customExpress_1.sendDataCreator)(data);
    })(Update = UserValidator.Update || (UserValidator.Update = {}));
    var GetAvatarUploadUrl;
    (function (GetAvatarUploadUrl) {
        var dataSchema = {
            type: 'object',
            properties: {
                avatar: { type: 'string' },
                uploadUrl: { type: 'string' },
            },
            required: ['avatar', 'uploadUrl'],
            additionalProperties: false,
        };
        var data = ajv_1.default.compile(dataSchema);
        GetAvatarUploadUrl.sendData = (0, customExpress_1.sendDataCreator)(data);
    })(GetAvatarUploadUrl = UserValidator.GetAvatarUploadUrl || (UserValidator.GetAvatarUploadUrl = {}));
    var ChangePassword;
    (function (ChangePassword) {
        var bodySchema = {
            type: 'object',
            properties: {
                currentPassword: { type: 'string', nullable: true },
                newPassword: { type: 'string' },
                token: { type: 'string', nullable: true },
            },
            required: ['newPassword'],
            additionalProperties: false,
        };
        ChangePassword.body = ajv_1.default.compile(bodySchema);
    })(ChangePassword = UserValidator.ChangePassword || (UserValidator.ChangePassword = {}));
    var ForgetPassword;
    (function (ForgetPassword) {
        ForgetPassword.body = ajv_1.default.compile(submitEmailSchema);
    })(ForgetPassword = UserValidator.ForgetPassword || (UserValidator.ForgetPassword = {}));
    var ResetPassword;
    (function (ResetPassword) {
        var bodySchema = {
            type: 'object',
            properties: {
                token: { type: 'string' },
                password: { type: 'string', nullable: true },
            },
            required: ['token'],
            additionalProperties: false,
        };
        ResetPassword.body = ajv_1.default.compile(bodySchema);
        var dataSchema = {
            type: 'object',
            properties: {
                token: { type: 'string', nullable: true },
            },
        };
        var data = ajv_1.default.compile(dataSchema);
        ResetPassword.sendData = (0, customExpress_1.sendDataCreator)(data);
    })(ResetPassword = UserValidator.ResetPassword || (UserValidator.ResetPassword = {}));
    // Template
    /*
     export namespace XXX {
      const bodySchema: JSONSchemaType<UserType.XXXBody> = {
        type: 'object',
        properties: {
        },
        required: [],
        additionalProperties: false,
      }
      export const body = ajv.compile(bodySchema)
      const dataSchema: JSONSchemaType<UserType.XXXData> = { type: '' }
      const data = ajv.compile(dataSchema)
      export const sendData = sendDataCreator<UserType.XXXData>(data)
    }
    */
})(UserValidator = exports.UserValidator || (exports.UserValidator = {}));
