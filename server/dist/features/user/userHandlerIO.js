"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIO = void 0;
const mongodb_1 = require("../../utils/mongodb");
const apiIO_1 = require("../apiIO");
const permissionType_1 = require("../../middlewares/permission/permissionType");
var UserIO;
(function (UserIO) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    const permissionFields = {
        role: { type: 'string', nullable: true },
        permission_groups: {
            type: 'array',
            items: {
                type: 'string',
                enum: permissionType_1.TwPermissons.permissionGroupNameSet,
            },
            nullable: true,
        },
        role_type: {
            type: 'string',
            enum: ['default', 'custom'],
            nullable: true,
        },
    };
    UserIO.plainUserSchema = {
        type: 'object',
        properties: {
            ...mongodb_1.MongooseStaticsJSONSchema,
            ...mongodb_1.MongooseStampsJSONSchema,
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
    const submitEmailSchema = {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },
        },
        required: ['email'],
        additionalProperties: false,
    };
    class SignUp extends (_b = apiIO_1.HandlerIO) {
    }
    _a = SignUp;
    SignUp.bodyValidator = Reflect.get(_b, "bodyValidatorCreator", _a).call(_a, submitEmailSchema);
    UserIO.SignUp = SignUp;
    class Verify extends (_d = apiIO_1.HandlerIO) {
    }
    _c = Verify;
    Verify.bodyValidator = Reflect.get(_d, "bodyValidatorCreator", _c).call(_c, {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
        },
        required: ['email', 'password'],
        additionalProperties: false,
    });
    Verify.sendData = Reflect.get(_d, "sendDataCreator", _c).call(_c, {
        type: 'string',
    });
    UserIO.Verify = Verify;
    class SignIn extends (_f = apiIO_1.HandlerIO) {
    }
    _e = SignIn;
    SignIn.bodyValidator = Reflect.get(_f, "bodyValidatorCreator", _e).call(_e, {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email', nullable: true },
            login_name: { type: 'string', format: 'email', nullable: true },
            password: { type: 'string' },
        },
        required: ['password'],
        additionalProperties: false,
    });
    UserIO.SignIn = SignIn;
    class GetUser extends (_h = apiIO_1.HandlerIO) {
    }
    _g = GetUser;
    GetUser.sendData = Reflect.get(_h, "sendDataCreator", _g).call(_g, UserIO.plainUserSchema);
    UserIO.GetUser = GetUser;
    class Update extends (_k = apiIO_1.HandlerIO) {
    }
    _j = Update;
    Update.bodyValidator = Reflect.get(_k, "bodyValidatorCreator", _j).call(_j, {
        type: 'object',
        properties: {
            username: { type: 'string', nullable: true },
            company: { type: 'string', nullable: true },
            avatar: { type: 'string', nullable: true },
        },
        required: [],
        additionalProperties: false,
    });
    Update.sendData = Reflect.get(_k, "sendDataCreator", _j).call(_j, UserIO.plainUserSchema);
    UserIO.Update = Update;
    class GetAvatarUploadUrl extends (_m = apiIO_1.HandlerIO) {
    }
    _l = GetAvatarUploadUrl;
    GetAvatarUploadUrl.sendData = Reflect.get(_m, "sendDataCreator", _l).call(_l, {
        type: 'object',
        properties: {
            avatar: { type: 'string' },
            uploadUrl: { type: 'string' },
        },
        required: ['avatar', 'uploadUrl'],
        additionalProperties: false,
    });
    UserIO.GetAvatarUploadUrl = GetAvatarUploadUrl;
    class ChangePassword extends (_p = apiIO_1.HandlerIO) {
    }
    _o = ChangePassword;
    ChangePassword.bodyValidator = Reflect.get(_p, "bodyValidatorCreator", _o).call(_o, {
        type: 'object',
        properties: {
            currentPassword: { type: 'string', nullable: true },
            newPassword: { type: 'string' },
            token: { type: 'string', nullable: true },
        },
        required: ['newPassword'],
        additionalProperties: false,
    });
    UserIO.ChangePassword = ChangePassword;
    class ForgetPassword extends (_r = apiIO_1.HandlerIO) {
    }
    _q = ForgetPassword;
    ForgetPassword.bodyValidator = Reflect.get(_r, "bodyValidatorCreator", _q).call(_q, submitEmailSchema);
    UserIO.ForgetPassword = ForgetPassword;
    class ResetPassword extends (_t = apiIO_1.HandlerIO) {
    }
    _s = ResetPassword;
    ResetPassword.bodyValidator = Reflect.get(_t, "bodyValidatorCreator", _s).call(_s, {
        type: 'object',
        properties: {
            token: { type: 'string' },
            password: { type: 'string', nullable: true },
        },
        required: ['token'],
        additionalProperties: false,
    });
    ResetPassword.sendData = Reflect.get(_t, "sendDataCreator", _s).call(_s, {
        type: 'object',
        properties: {
            token: { type: 'string', nullable: true },
        },
    });
    UserIO.ResetPassword = ResetPassword;
    class GetWorkers extends (_v = apiIO_1.HandlerIO) {
    }
    _u = GetWorkers;
    GetWorkers.sendData = Reflect.get(_v, "sendDataCreator", _u).call(_u, {
        type: 'array',
        items: UserIO.plainUserSchema,
    });
    UserIO.GetWorkers = GetWorkers;
    class GetWorker extends (_x = apiIO_1.HandlerIO) {
    }
    _w = GetWorker;
    GetWorker.sendData = Reflect.get(_x, "sendDataCreator", _w).call(_w, UserIO.plainUserSchema);
    UserIO.GetWorker = GetWorker;
    class CreateWorker extends (_z = apiIO_1.HandlerIO) {
    }
    _y = CreateWorker;
    CreateWorker.bodyValidator = Reflect.get(_z, "bodyValidatorCreator", _y).call(_y, {
        type: 'object',
        properties: {
            login_name: { type: 'string' },
            password: { type: 'string' },
            ...permissionFields,
        },
        required: ['login_name', 'password', 'role_type', 'permission_groups'],
        additionalProperties: false,
    });
    CreateWorker.sendData = Reflect.get(_z, "sendDataCreator", _y).call(_y, UserIO.plainUserSchema);
    UserIO.CreateWorker = CreateWorker;
    class UpdateWorker extends (_1 = apiIO_1.HandlerIO) {
    }
    _0 = UpdateWorker;
    UpdateWorker.bodyValidator = Reflect.get(_1, "bodyValidatorCreator", _0).call(_0, {
        type: 'object',
        properties: {
            password: { type: 'string', nullable: true },
            ...permissionFields,
        },
        additionalProperties: false,
    });
    UpdateWorker.sendData = Reflect.get(_1, "sendDataCreator", _0).call(_0, UserIO.plainUserSchema);
    UserIO.UpdateWorker = UpdateWorker;
    class DeleteWorker extends (_3 = apiIO_1.HandlerIO) {
    }
    _2 = DeleteWorker;
    DeleteWorker.sendData = Reflect.get(_3, "sendDataCreator", _2).call(_2, UserIO.plainUserSchema);
    UserIO.DeleteWorker = DeleteWorker;
})(UserIO = exports.UserIO || (exports.UserIO = {}));
