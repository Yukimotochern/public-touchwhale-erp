"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleIO = void 0;
const permissionType_1 = require("../../middlewares/permission/permissionType");
const mongodb_1 = require("../../utils/mongodb");
const apiIO_1 = require("../apiIO");
const userHandlerIO_1 = require("../user/userHandlerIO");
var RoleIO;
(function (RoleIO) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const classifierFields = {
        owner: { type: 'string' },
    };
    const editableFields = {
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
    const plainRoleSchema = {
        type: 'object',
        properties: {
            ...mongodb_1.MongooseStaticsJSONSchema,
            ...mongodb_1.MongooseStampsJSONSchema,
            ...editableFields,
            ...classifierFields,
        },
        required: ['name', 'permission_groups'],
        additionalProperties: false,
    };
    class GetRoles extends (_b = apiIO_1.HandlerIO) {
    }
    _a = GetRoles;
    GetRoles.sendData = Reflect.get(_b, "sendDataCreator", _a).call(_a, {
        type: 'array',
        items: {
            ...plainRoleSchema,
        },
    });
    RoleIO.GetRoles = GetRoles;
    class GetRole extends (_d = apiIO_1.HandlerIO) {
    }
    _c = GetRole;
    GetRole.sendData = Reflect.get(_d, "sendDataCreator", _c).call(_c, plainRoleSchema);
    RoleIO.GetRole = GetRole;
    class CreateRole extends (_f = apiIO_1.HandlerIO) {
    }
    _e = CreateRole;
    CreateRole.bodyValidator = Reflect.get(_f, "bodyValidatorCreator", _e).call(_e, {
        type: 'object',
        properties: {
            ...editableFields,
        },
        required: ['name', 'permission_groups'],
        additionalProperties: false,
    });
    CreateRole.sendData = Reflect.get(_f, "sendDataCreator", _e).call(_e, plainRoleSchema);
    RoleIO.CreateRole = CreateRole;
    class UpdateRole extends (_h = apiIO_1.HandlerIO) {
    }
    _g = UpdateRole;
    UpdateRole.bodyValidator = Reflect.get(_h, "bodyValidatorCreator", _g).call(_g, {
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
    UpdateRole.sendData = Reflect.get(_h, "sendDataCreator", _g).call(_g, {
        type: 'object',
        properties: {
            isUpdateDone: { type: 'boolean' },
            updatedRole: { ...plainRoleSchema, nullable: true },
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
    RoleIO.UpdateRole = UpdateRole;
    class DeleteRole extends (_k = apiIO_1.HandlerIO) {
    }
    _j = DeleteRole;
    DeleteRole.sendData = Reflect.get(_k, "sendDataCreator", _j).call(_j, {
        type: 'object',
        properties: {
            deleted: { type: 'boolean' },
            deletedRole: { ...plainRoleSchema, nullable: true },
            usersOfThisRole: {
                type: 'array',
                items: userHandlerIO_1.UserIO.plainUserSchema,
                nullable: true,
            },
        },
        required: ['deleted'],
    });
    RoleIO.DeleteRole = DeleteRole;
})(RoleIO = exports.RoleIO || (exports.RoleIO = {}));
