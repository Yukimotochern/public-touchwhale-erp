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
exports.RoleIO = void 0;
var permissionType_1 = require("../../middlewares/permission/permissionType");
var mongodb_1 = require("../../utils/mongodb");
var apiIO_1 = require("../apiIO");
var userHandlerIO_1 = require("../user/userHandlerIO");
var RoleIO;
(function (RoleIO) {
    var classifierFields = {
        owner: { type: 'string' },
    };
    var editableFields = {
        name: { type: 'string' },
        description: { type: 'string', nullable: true },
        permission_groups: {
            type: 'array',
            items: {
                type: 'string',
                enum: permissionType_1.TwPermissons.permissionGroupNameSet,
            },
        },
    };
    var plainRoleSchema = {
        type: 'object',
        properties: __assign(__assign(__assign(__assign({}, mongodb_1.MongooseStaticsJSONSchema), mongodb_1.MongooseStampsJSONSchema), editableFields), classifierFields),
        required: ['name', 'permission_groups'],
        additionalProperties: false,
    };
    var GetRoles = /** @class */ (function (_super) {
        __extends(GetRoles, _super);
        function GetRoles() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _a;
        _a = GetRoles;
        GetRoles.sendData = _super.sendDataCreator.call(_a, {
            type: 'array',
            items: __assign({}, plainRoleSchema),
        });
        return GetRoles;
    }(apiIO_1.HandlerIO));
    RoleIO.GetRoles = GetRoles;
    var GetRole = /** @class */ (function (_super) {
        __extends(GetRole, _super);
        function GetRole() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _b;
        _b = GetRole;
        GetRole.sendData = _super.sendDataCreator.call(_b, plainRoleSchema);
        return GetRole;
    }(apiIO_1.HandlerIO));
    RoleIO.GetRole = GetRole;
    var CreateRole = /** @class */ (function (_super) {
        __extends(CreateRole, _super);
        function CreateRole() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _c;
        _c = CreateRole;
        CreateRole.bodyValidator = _super.bodyValidatorCreator.call(_c, {
            type: 'object',
            properties: __assign({}, editableFields),
            required: ['name', 'permission_groups'],
            additionalProperties: false,
        });
        CreateRole.sendData = _super.sendDataCreator.call(_c, plainRoleSchema);
        return CreateRole;
    }(apiIO_1.HandlerIO));
    RoleIO.CreateRole = CreateRole;
    var UpdateRole = /** @class */ (function (_super) {
        __extends(UpdateRole, _super);
        function UpdateRole() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _d;
        _d = UpdateRole;
        UpdateRole.bodyValidator = _super.bodyValidatorCreator.call(_d, {
            type: 'object',
            properties: {
                shouldCascade: { type: 'boolean' },
                updates: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', nullable: true },
                        description: { type: 'string', nullable: true },
                        permission_groups: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: permissionType_1.TwPermissons.permissionGroupNameSet,
                            },
                            nullable: true,
                        },
                    },
                    additionalProperties: false,
                },
            },
            required: ['shouldCascade', 'updates'],
        });
        UpdateRole.sendData = _super.sendDataCreator.call(_d, {
            type: 'object',
            properties: {
                isUpdateDone: { type: 'boolean' },
                updatedRole: __assign(__assign({}, plainRoleSchema), { nullable: true }),
                userAffected: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            user: userHandlerIO_1.UserIO.plainUserSchema,
                            shouldAdd: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    enum: permissionType_1.TwPermissons.permissionGroupNameSet,
                                },
                            },
                            shouldRemove: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    enum: permissionType_1.TwPermissons.permissionGroupNameSet,
                                },
                            },
                        },
                        required: ['shouldAdd', 'shouldRemove', 'user'],
                        additionalProperties: false,
                    },
                    nullable: true,
                },
            },
            required: ['isUpdateDone'],
            additionalProperties: false,
        });
        return UpdateRole;
    }(apiIO_1.HandlerIO));
    RoleIO.UpdateRole = UpdateRole;
    var DeleteRole = /** @class */ (function (_super) {
        __extends(DeleteRole, _super);
        function DeleteRole() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _e;
        _e = DeleteRole;
        DeleteRole.sendData = _super.sendDataCreator.call(_e, {
            type: 'object',
            properties: {
                deleted: { type: 'boolean' },
                deletedRole: __assign(__assign({}, plainRoleSchema), { nullable: true }),
                usersOfThisRole: {
                    type: 'array',
                    items: userHandlerIO_1.UserIO.plainUserSchema,
                    nullable: true,
                },
            },
            required: ['deleted'],
        });
        return DeleteRole;
    }(apiIO_1.HandlerIO));
    RoleIO.DeleteRole = DeleteRole;
})(RoleIO = exports.RoleIO || (exports.RoleIO = {}));
