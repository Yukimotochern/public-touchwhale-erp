"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUp = exports.plainUserSchema = void 0;
const api_1 = require("../api");
const mongoTypes_1 = require("../utils/mongoTypes");
const permissions_1 = require("../permissions");
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
            enum: permissions_1.permissionGroupNameSet,
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
    SignUp.signUpApi = new api_1.api({
        bodySchema: submitEmailSchema,
    });
    SignUp.signUp = async (email) => SignUp.signUpApi.request('/user/signUp', 'POST', {
        email,
    });
})(SignUp = exports.SignUp || (exports.SignUp = {}));
// export namespace Verify {
//   // types
//   export interface Body
//     extends Required<Pick<Identity, 'email'>>,
//       Required<Secret> {}
//   export type Data = ReturnType<Mongoose['getSignedJWTToken']>
//   // validator
//   export const validator = new Validator<Body, Data>({
//     bodySchema: {
//       type: 'object',
//       properties: {
//         email: { type: 'string', format: 'email' },
//         password: { type: 'string' },
//       },
//       required: ['email', 'password'],
//       additionalProperties: false,
//     },
//     dataSchema: { type: 'string' },
//   })
// }
// export namespace SignIn {
//   export interface Body extends Identity, Required<Secret> {}
//   export const validator = new Validator<Body, any>({
//     bodySchema: {
//       type: 'object',
//       properties: {
//         email: { type: 'string', format: 'email', nullable: true },
//         login_name: { type: 'string', format: 'email', nullable: true },
//         password: { type: 'string' },
//       },
//       required: ['password'],
//       additionalProperties: false,
//     },
//   })
// }
// export namespace Update {
//   export interface Body extends Editable {}
//   export interface Data extends PlainUser {}
//   export const validator = new Validator<Body, Data>({
//     bodySchema: {
//       type: 'object',
//       properties: {
//         username: { type: 'string', nullable: true },
//         company: { type: 'string', nullable: true },
//         avatar: { type: 'string', nullable: true },
//       },
//       required: [],
//       additionalProperties: false,
//     },
//     dataSchema: plainUserSchema,
//   })
// }
// export namespace GetUser {
//   export interface Data extends PlainUser {}
//   export const validator = new Validator<any, Data>({
//     dataSchema: plainUserSchema,
//   })
// }
// export namespace GetAvatarUploadUrl {
//   export interface Data extends Required<Pick<Editable, 'avatar'>> {
//     uploadUrl: string
//   }
//   export const validator = new Validator<any, Data>({
//     dataSchema: {
//       type: 'object',
//       properties: {
//         avatar: { type: 'string' },
//         uploadUrl: { type: 'string' },
//       },
//       required: ['avatar', 'uploadUrl'],
//       additionalProperties: false,
//     },
//   })
// }
// export namespace ChangePassword {
//   export interface Body {
//     currentPassword?: string
//     newPassword: string
//     token?: string
//   }
//   export const validator = new Validator<Body, any>({
//     bodySchema: {
//       type: 'object',
//       properties: {
//         currentPassword: { type: 'string', nullable: true },
//         newPassword: { type: 'string' },
//         token: { type: 'string', nullable: true },
//       },
//       required: ['newPassword'],
//       additionalProperties: false,
//     },
//   })
// }
// export namespace ForgetPassword {
//   export interface Body extends SubmitEmail {}
//   export const validator = new Validator<Body, any>({
//     bodySchema: submitEmailSchema,
//   })
// }
// export namespace ResetPassword {
//   export interface Body extends Partial<Secret> {
//     token: string
//   }
//   export interface Data {
//     token?: string
//   }
//   export const validator = new Validator<Body, Data>({
//     bodySchema: {
//       type: 'object',
//       properties: {
//         token: { type: 'string' },
//         password: { type: 'string', nullable: true },
//       },
//       required: ['token'],
//       additionalProperties: false,
//     },
//     dataSchema: {
//       type: 'object',
//       properties: {
//         token: { type: 'string', nullable: true },
//       },
//     },
//   })
// }
// export namespace GetWorkers {
//   export type Data = PlainUser[]
//   export const validator = new Validator<any, Data>({
//     dataSchema: {
//       type: 'array',
//       items: plainUserSchema,
//     },
//   })
// }
// export namespace GetWorker {
//   export interface Data extends PlainUser {}
//   export const validator = new Validator<any, Data>({
//     dataSchema: plainUserSchema,
//   })
// }
// export namespace CreateWorker {
//   export interface Body
//     extends Required<Pick<Identity, 'login_name'>>,
//       Required<Secret>,
//       Required<RolePermissions> {}
//   export interface Data extends PlainUser {}
//   export const validator = new Validator<Body, Data>({
//     bodySchema: {
//       type: 'object',
//       properties: {
//         login_name: { type: 'string' },
//         password: { type: 'string' },
//         ...permissionFields,
//       },
//       required: ['login_name', 'password', 'role_type', 'permission_groups'],
//       additionalProperties: false,
//     },
//     dataSchema: plainUserSchema,
//   })
// }
// export namespace UpdateWorker {
//   export interface Body extends Secret, RolePermissions {}
//   export interface Data extends PlainUser {}
//   export const validator = new Validator<Body, Data>({
//     bodySchema: {
//       type: 'object',
//       properties: {
//         password: { type: 'string', nullable: true },
//         ...permissionFields,
//       },
//       additionalProperties: false,
//     },
//     dataSchema: plainUserSchema,
//   })
// }
// export namespace DeleteWorker {
//   export interface Data extends PlainUser {}
//   export const validator = new Validator<any, Data>({
//     dataSchema: plainUserSchema,
//   })
// }
