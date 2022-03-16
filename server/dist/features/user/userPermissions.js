"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermissions = void 0;
var UserPermissions;
(function (UserPermissions) {
    var _permissionSet = [
        // These are reserved for system.
        // These can be public or open for all login users with correct status, like isActive, isOwner, ... etc.
        // This means that they should not be included in the permission consideration.
        // 'sign_up',
        // 'verify',
        // 'sign_in',
        // 'oauth_callback',
        // 'sign_out',
        // 'get_user',
        // 'update',
        // 'get_avatar_upload_url',
        // 'delete_avatar',
        // 'change_password',
        // 'forget_password',
        // 'reset_password',
        // Below are HR permission
        'get_worker',
        'get_workers',
        'create_worker',
        'update_worker',
        'update_worker',
        'delete_worker',
    ];
    UserPermissions.permissionSet = _permissionSet.map(function (controller_permission) { return "user.".concat(controller_permission); });
    // TODO check uniqueness of permission set
})(UserPermissions = exports.UserPermissions || (exports.UserPermissions = {}));
