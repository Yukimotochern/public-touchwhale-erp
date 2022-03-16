"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwPermissons = void 0;
var userPermissions_1 = require("../../features/user/userPermissions");
var rolePermissions_1 = require("../../features/role/rolePermissions");
// To add a permission for feature:
// 1. include XXX.Permissions into Permissions
// 2. add the permission strings to relevant permission group in permissionGroup set
// 3. make sure the permission group resides somewhere in the permission tree
var TwPermissons;
(function (TwPermissons) {
    // union of all the permissions to controllers
    TwPermissons.permissionSet = __spreadArray([], userPermissions_1.UserPermissions.permissionSet, true);
    // ***
    // *** Then, ADD GROUP NAME HERE!!!
    TwPermissons.permissionGroupNameSet = ['admin', 'human resource'];
    // *** Third, ADD PERMISSIONS IN GROUP HERE
    TwPermissons.permissionGroupSet = [
        {
            name: 'admin',
            permissions: __spreadArray(__spreadArray([], userPermissions_1.UserPermissions.permissionSet, true), rolePermissions_1.RolePermissions.permissionSet, true),
            description: 'Can perform some basic CRUD actions to the twItem',
        },
        {
            name: 'human resource',
            permissions: __spreadArray([
                // Worker CRUD
                'user.create_worker',
                'user.delete_worker',
                'user.get_worker',
                'user.get_workers',
                'user.update_worker'
            ], rolePermissions_1.RolePermissions.permissionSet, true),
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
