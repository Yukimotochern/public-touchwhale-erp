"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwPermissons = void 0;
const userPermissions_1 = require("../../features/user/userPermissions");
const rolePermissions_1 = require("../../features/role/rolePermissions");
// To add a permission for feature:
// 1. include XXX.Permissions into Permissions
// 2. add the permission strings to relevant permission group in permissionGroup set
// 3. make sure the permission group resides somewhere in the permission tree
var TwPermissons;
(function (TwPermissons) {
    // union of all the permissions to controllers
    TwPermissons.permissionSet = [
        ...userPermissions_1.UserPermissions.permissionSet,
        ...rolePermissions_1.RolePermissions.permissionSet,
    ];
    // ***
    // *** Then, ADD GROUP NAME HERE!!!
    TwPermissons.permissionGroupNameSet = ['admin', 'human resource'];
    // *** Third, ADD PERMISSIONS IN GROUP HERE
    TwPermissons.permissionGroupSet = [
        {
            name: 'admin',
            permissions: [
                ...userPermissions_1.UserPermissions.permissionSet,
                ...rolePermissions_1.RolePermissions.permissionSet,
            ],
            description: 'Can perform some basic CRUD actions to the twItem',
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
                ...rolePermissions_1.RolePermissions.permissionSet,
            ],
            description: '',
        },
    ];
    TwPermissons.defaultRoles = [
        {
            name: 'admin',
            description: 'Have access to all functionality.',
            permission_groups: ['admin', 'human resource'],
        },
    ];
})(TwPermissons = exports.TwPermissons || (exports.TwPermissons = {}));
