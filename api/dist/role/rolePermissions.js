"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolePermissionSet = exports.permissionSet = void 0;
const _permissionSet = [
    'get_roles',
    'get_role',
    'create_role',
    'update_role',
    'delete_role',
];
exports.permissionSet = _permissionSet.map((controller_permission) => `role.${controller_permission}`);
exports.rolePermissionSet = exports.permissionSet;
