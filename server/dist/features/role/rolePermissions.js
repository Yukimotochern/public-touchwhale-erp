"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissions = void 0;
var RolePermissions;
(function (RolePermissions) {
    const _permissionSet = [
        'get_roles',
        'get_role',
        'create_role',
        'update_role',
        'delete_role',
    ];
    RolePermissions.permissionSet = _permissionSet.map((controller_permission) => `role.${controller_permission}`);
    // TODO check uniqueness of permission set
})(RolePermissions = exports.RolePermissions || (exports.RolePermissions = {}));
