"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
var ajv_1 = __importDefault(require("../../utils/ajv"));
var customExpress_1 = require("../../utils/customExpress");
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
    var SignUp;
    (function (SignUp) {
        var schema = {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email' },
            },
            required: ['email'],
            additionalProperties: false,
        };
        SignUp.body = ajv_1.default.compile(schema);
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
