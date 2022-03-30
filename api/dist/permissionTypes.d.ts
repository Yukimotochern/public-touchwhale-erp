import { UserPermissions } from './user/userPermissions';
import { RolePermissions } from './role/rolePermissions';
import { TwItemPermissions } from './twItem/twItemPermissions';
/**
 * To add a permission for feature:
 * 1. include XxxPermissions into Permissions
 * 2. add the permission strings to relevant permission group in permissionGroup set
 * 3. make sure the permission group resides somewhere in the permission tree
 */
export declare type Permissions = UserPermissions | RolePermissions | TwItemPermissions;
export declare const permissionSet: Permissions[];
export declare const permissionGroupNameSet: readonly ["admin", "human resource"];
export declare type PermissionGroupNames = typeof permissionGroupNameSet[number];
interface PermissionGroup {
    name: PermissionGroupNames;
    permissions: Permissions[];
    description: string;
}
export declare const permissionGroupSet: PermissionGroup[];
export interface DefaultRole {
    name: string;
    description: string;
    permission_groups: PermissionGroupNames[];
}
export declare const defaultRoles: DefaultRole[];
export {};
