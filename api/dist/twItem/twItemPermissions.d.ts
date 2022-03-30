declare const _permissionSet: readonly ["get_items_with_detail", "get_items", "create_item", "get_item", "upload_img", "delete_img", "update_item", "delete_item"];
declare type controllers = typeof _permissionSet[number];
export declare type Permissions = `tw_item.${controllers}`;
export declare const permissionSet: ("tw_item.get_items_with_detail" | "tw_item.get_items" | "tw_item.create_item" | "tw_item.get_item" | "tw_item.upload_img" | "tw_item.delete_img" | "tw_item.update_item" | "tw_item.delete_item")[];
export { permissionSet as twItemPermissionSet };
export type { Permissions as TwItemPermissions };
