"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twItemPermissionSet = exports.permissionSet = void 0;
const _permissionSet = [
    'get_items_with_detail',
    'get_items',
    'create_item',
    'get_item',
    'upload_img',
    'delete_img',
    'update_item',
    'delete_item',
];
exports.permissionSet = _permissionSet.map((controller_permission) => `tw_item.${controller_permission}`);
exports.twItemPermissionSet = exports.permissionSet;
