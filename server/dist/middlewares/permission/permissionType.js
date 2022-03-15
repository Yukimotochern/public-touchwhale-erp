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
// To add a permission for feature:
// 1. include XXX.Permissions into Permissions
// 2. add the permission strings to relevant permission group in permissionGroup set
// 3. make sure the permission group resides somewhere in the permission tree
var TwPermissons;
(function (TwPermissons) {
    TwPermissons.permissionSet = __spreadArray([], userPermissions_1.UserPermissions.permissionSet, true);
    // union of all the permission group
    TwPermissons.permissionGroupNameSet = ['basic', 'human resource'];
    TwPermissons.permissionGroupSet = [
        {
            name: 'basic',
            permissions: [
            // user
            ],
            description: 'Can perform some basic CRUD actions to the ',
        },
        {
            name: 'human resource',
            permissions: ['role.get_role', 'role.get_roles', 'role.create_role'],
            description: '',
        },
    ];
    TwPermissons.defaultRoles = [
        {
            name: 'admin',
            description: 'Have access to all functionality.',
            permission_groups: ['basic', 'human resource'],
        },
    ];
})(TwPermissons = exports.TwPermissons || (exports.TwPermissons = {}));
