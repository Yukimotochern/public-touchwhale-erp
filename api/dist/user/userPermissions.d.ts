declare const _permissionSet: readonly ["get_worker", "get_workers", "create_worker", "update_worker", "update_worker", "delete_worker"];
declare type controllers = typeof _permissionSet[number];
declare type Permissions = `user.${controllers}`;
declare const permissionSet: ("user.get_worker" | "user.get_workers" | "user.create_worker" | "user.update_worker" | "user.delete_worker")[];
export { permissionSet as userPermissionSet };
export type { Permissions as UserPermissions };
