"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPermissionSet = void 0;
const _permissionSet = [
    'get_worker',
    'get_workers',
    'create_worker',
    'update_worker',
    'update_worker',
    'delete_worker',
];
const permissionSet = _permissionSet.map(
// Change the `user. part !! in the next line
(controller_permission) => `user.${controller_permission}`);
exports.userPermissionSet = permissionSet;
