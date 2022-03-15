"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIO = void 0;
var mongodb_1 = require("../../utils/mongodb");
var apiIO_1 = require("../apiIO");
var permissionType_1 = require("../../middlewares/permission/permissionType");
/*
  TEMPLATE HERE
  export class XXX extends HandlerIO {
    static bodyValidator = super.bodyValidatorCreator<yyyType.XXXBody>({<bodySchema>})
    static sendData = super.sendDataCreator<yyyType.XXXData>({dataSchema})
  }
*/
var UserIO;
(function (UserIO) {
    var plainUserSchema = {
        type: 'object',
        properties: __assign(__assign(__assign({}, mongodb_1.MongooseStaticsJSONSchema), mongodb_1.MongooseStampsJSONSchema), { isOwner: { type: 'boolean' }, owner: { type: 'string', nullable: true }, isActive: { type: 'boolean' }, provider: { type: 'string', enum: ['Google', 'TouchWhale'] }, email: { type: 'string', nullable: true, format: 'email' }, login_name: { type: 'string', nullable: true }, username: { type: 'string', nullable: true }, company: { type: 'string', nullable: true }, avatar: { type: 'string', nullable: true }, role: { type: 'string', nullable: true }, permission_groups: {
                type: 'array',
                items: {
                    type: 'string',
                    enum: permissionType_1.TwPermissons.permissionGroupNameSet,
                },
                nullable: true,
            }, role_type: {
                type: 'string',
                enum: ['default', 'custom'],
                nullable: true,
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
    var SignUp = /** @class */ (function (_super) {
        __extends(SignUp, _super);
        function SignUp() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _a;
        _a = SignUp;
        SignUp.bodyValidator = _super.bodyValidatorCreator.call(_a, submitEmailSchema);
        return SignUp;
    }(apiIO_1.HandlerIO));
    UserIO.SignUp = SignUp;
    var Verify = /** @class */ (function (_super) {
        __extends(Verify, _super);
        function Verify() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _b;
        _b = Verify;
        Verify.bodyValidator = _super.bodyValidatorCreator.call(_b, {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
            },
            required: ['email', 'password'],
            additionalProperties: false,
        });
        Verify.sendData = _super.sendDataCreator.call(_b, {
            type: 'string',
        });
        return Verify;
    }(apiIO_1.HandlerIO));
    UserIO.Verify = Verify;
    var SignIn = /** @class */ (function (_super) {
        __extends(SignIn, _super);
        function SignIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _c;
        _c = SignIn;
        SignIn.bodyValidator = _super.bodyValidatorCreator.call(_c, {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email', nullable: true },
                login_name: { type: 'string', format: 'email', nullable: true },
                password: { type: 'string' },
            },
            required: ['password'],
            additionalProperties: false,
        });
        return SignIn;
    }(apiIO_1.HandlerIO));
    UserIO.SignIn = SignIn;
    var GetUser = /** @class */ (function (_super) {
        __extends(GetUser, _super);
        function GetUser() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _d;
        _d = GetUser;
        GetUser.sendData = _super.sendDataCreator.call(_d, plainUserSchema);
        return GetUser;
    }(apiIO_1.HandlerIO));
    UserIO.GetUser = GetUser;
    var Update = /** @class */ (function (_super) {
        __extends(Update, _super);
        function Update() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _e;
        _e = Update;
        Update.bodyValidator = _super.bodyValidatorCreator.call(_e, {
            type: 'object',
            properties: {
                username: { type: 'string', nullable: true },
                company: { type: 'string', nullable: true },
                avatar: { type: 'string', nullable: true },
            },
            required: [],
            additionalProperties: false,
        });
        Update.sendData = _super.sendDataCreator.call(_e, plainUserSchema);
        return Update;
    }(apiIO_1.HandlerIO));
    UserIO.Update = Update;
    var GetAvatarUploadUrl = /** @class */ (function (_super) {
        __extends(GetAvatarUploadUrl, _super);
        function GetAvatarUploadUrl() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _f;
        _f = GetAvatarUploadUrl;
        GetAvatarUploadUrl.sendData = _super.sendDataCreator.call(_f, {
            type: 'object',
            properties: {
                avatar: { type: 'string' },
                uploadUrl: { type: 'string' },
            },
            required: ['avatar', 'uploadUrl'],
            additionalProperties: false,
        });
        return GetAvatarUploadUrl;
    }(apiIO_1.HandlerIO));
    UserIO.GetAvatarUploadUrl = GetAvatarUploadUrl;
    var ChangePassword = /** @class */ (function (_super) {
        __extends(ChangePassword, _super);
        function ChangePassword() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _g;
        _g = ChangePassword;
        ChangePassword.bodyValidator = _super.bodyValidatorCreator.call(_g, {
            type: 'object',
            properties: {
                currentPassword: { type: 'string', nullable: true },
                newPassword: { type: 'string' },
                token: { type: 'string', nullable: true },
            },
            required: ['newPassword'],
            additionalProperties: false,
        });
        return ChangePassword;
    }(apiIO_1.HandlerIO));
    UserIO.ChangePassword = ChangePassword;
    var ForgetPassword = /** @class */ (function (_super) {
        __extends(ForgetPassword, _super);
        function ForgetPassword() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _h;
        _h = ForgetPassword;
        ForgetPassword.bodyValidator = _super.bodyValidatorCreator.call(_h, submitEmailSchema);
        return ForgetPassword;
    }(apiIO_1.HandlerIO));
    UserIO.ForgetPassword = ForgetPassword;
    var ResetPassword = /** @class */ (function (_super) {
        __extends(ResetPassword, _super);
        function ResetPassword() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _j;
        _j = ResetPassword;
        ResetPassword.bodyValidator = _super.bodyValidatorCreator.call(_j, {
            type: 'object',
            properties: {
                token: { type: 'string' },
                password: { type: 'string', nullable: true },
            },
            required: ['token'],
            additionalProperties: false,
        });
        ResetPassword.sendData = _super.sendDataCreator.call(_j, {
            type: 'object',
            properties: {
                token: { type: 'string', nullable: true },
            },
        });
        return ResetPassword;
    }(apiIO_1.HandlerIO));
    UserIO.ResetPassword = ResetPassword;
})(UserIO = exports.UserIO || (exports.UserIO = {}));
