declare const _permissionSet: readonly ["get_roles", "get_role", "create_role", "update_role", "delete_role"];
declare type controllers = typeof _permissionSet[number];
export declare type Permissions = `role.${controllers}`;
export declare const permissionSet: ("role.get_roles" | "role.get_role" | "role.create_role" | "role.update_role" | "role.delete_role")[];
export { permissionSet as rolePermissionSet };
export type { Permissions as RolePermissions };
