"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRoles = exports.permissionGroupSet = exports.permissionGroupNameSet = exports.permissionSet = void 0;
const userPermissions_1 = require("./user/userPermissions");
const rolePermissions_1 = require("./role/rolePermissions");
const twItemPermissions_1 = require("./twItem/twItemPermissions");
exports.permissionSet = [
    ...userPermissions_1.userPermissionSet,
    ...rolePermissions_1.rolePermissionSet,
    ...twItemPermissions_1.twItemPermissionSet,
];
// **
// ** Then, ADD GROUP NAME HERE!!!
exports.permissionGroupNameSet = ['admin', 'human resource'];
// *** Third, ADD PERMISSIONS IN GROUP HERE
exports.permissionGroupSet = [
    {
        name: 'admin',
        permissions: [
            ...userPermissions_1.userPermissionSet,
            ...rolePermissions_1.rolePermissionSet,
            ...twItemPermissions_1.twItemPermissionSet,
        ],
        description: 'All permissions.',
    },
    {
        name: 'human resource',
        permissions: [
            // Worker CRUD
            'user.create_worker',
            'user.delete_worker',
            'user.get_worker',
            'user.get_workers',
            'user.update_worker',
            // role CRUD
            ...rolePermissions_1.rolePermissionSet,
        ],
        description: '',
    },
];
exports.defaultRoles = [
    {
        name: 'admin',
        description: 'Have access to all functionality.',
        permission_groups: ['admin', 'human resource'],
    },
];
