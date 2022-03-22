"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermissions = void 0;
var UserPermissions;
(function (UserPermissions) {
    const _permissionSet = [
        'get_worker',
        'get_workers',
        'create_worker',
        'update_worker',
        'update_worker',
        'delete_worker',
    ];
    UserPermissions.permissionSet = _permissionSet.map((controller_permission) => `user.${controller_permission}`);
    // TODO check uniqueness of permission set
})(UserPermissions = exports.UserPermissions || (exports.UserPermissions = {}));
