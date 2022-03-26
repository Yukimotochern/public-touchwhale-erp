"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRole = exports.UpdateRole = exports.CreateRole = exports.GetRole = exports.GetRoles = void 0;
const userApi_1 = require("../user/userApi");
const api_1 = require("../api");
const permissionTypes_1 = require("../permissionTypes");
const mongoTypes_1 = require("../utils/mongoTypes");
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
            enum: permissionTypes_1.permissionGroupNameSet,
        },
    },
};
const plainRoleSchema = {
    type: 'object',
    properties: {
        ...mongoTypes_1.MongooseStaticsJSONSchema,
        ...mongoTypes_1.MongooseStampsJSONSchema,
        ...editableFields,
        ...classifierFields,
    },
    required: ['name', 'permission_groups'],
    additionalProperties: false,
};
var GetRoles;
(function (GetRoles) {
    GetRoles.API = new api_1.api({
        dataSchema: {
            type: 'array',
            items: {
                ...plainRoleSchema,
            },
        },
    });
})(GetRoles = exports.GetRoles || (exports.GetRoles = {}));
var GetRole;
(function (GetRole) {
    GetRole.API = new api_1.api({
        dataSchema: plainRoleSchema,
    });
})(GetRole = exports.GetRole || (exports.GetRole = {}));
var CreateRole;
(function (CreateRole) {
    CreateRole.API = new api_1.api({
        bodySchema: {
            type: 'object',
            properties: {
                ...editableFields,
            },
            required: ['name', 'permission_groups'],
            additionalProperties: false,
        },
        dataSchema: plainRoleSchema,
    });
})(CreateRole = exports.CreateRole || (exports.CreateRole = {}));
var UpdateRole;
(function (UpdateRole) {
    UpdateRole.API = new api_1.api({
        bodySchema: {
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
                                enum: permissionTypes_1.permissionGroupNameSet,
                            },
                            nullable: true,
                        },
                    },
                    additionalProperties: false,
                },
            },
            required: ['shouldCascade', 'updates'],
        },
        dataSchema: {
            type: 'object',
            properties: {
                isUpdateDone: { type: 'boolean' },
                updatedRole: { ...plainRoleSchema, nullable: true },
                userAffected: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            user: userApi_1.plainUserSchema,
                            shouldAdd: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    enum: permissionTypes_1.permissionGroupNameSet,
                                },
                            },
                            shouldRemove: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    enum: permissionTypes_1.permissionGroupNameSet,
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
        },
    });
})(UpdateRole = exports.UpdateRole || (exports.UpdateRole = {}));
var DeleteRole;
(function (DeleteRole) {
    DeleteRole.API = new api_1.api({
        dataSchema: {
            type: 'object',
            properties: {
                deleted: { type: 'boolean' },
                deletedRole: { ...plainRoleSchema, nullable: true },
                usersOfThisRole: {
                    type: 'array',
                    items: userApi_1.plainUserSchema,
                    nullable: true,
                },
            },
            required: ['deleted'],
        },
    });
})(DeleteRole = exports.DeleteRole || (exports.DeleteRole = {}));
