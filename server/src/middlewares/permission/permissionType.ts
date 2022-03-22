import { UserPermissions } from '../../features/user/userPermissions'
import { RolePermissions } from '../../features/role/rolePermissions'

// To add a permission for feature:
// 1. include XXX.Permissions into Permissions
// 2. add the permission strings to relevant permission group in permissionGroup set
// 3. make sure the permission group resides somewhere in the permission tree

export namespace TwPermissons {
  // union of all the permissions to controllers
  export type Permissions =
    | UserPermissions.Permissions
    | RolePermissions.Permissions
  export const permissionSet: Permissions[] = [
    ...UserPermissions.permissionSet,
    ...RolePermissions.permissionSet,
  ]
  // ***

  // *** Then, ADD GROUP NAME HERE!!!
  export const permissionGroupNameSet = ['admin', 'human resource'] as const
  // ***

  export type PermissionGroupNames = typeof permissionGroupNameSet[number]
  interface PermissionGroup {
    name: PermissionGroupNames
    permissions: Permissions[]
    description: string
  }

  // *** Third, ADD PERMISSIONS IN GROUP HERE
  export const permissionGroupSet: PermissionGroup[] = [
    {
      name: 'admin',
      permissions: [
        ...UserPermissions.permissionSet,
        ...RolePermissions.permissionSet,
      ],
      description: 'Can perform some basic CRUD actions to the twItem',
    },
    {
      name: 'human resource',
      permissions: [
        // Worker CRUD
        'user.create_worker',
        'user.delete_worker',
        'user.get_worker',
        'user.get_workers',
        'user.update_worker',
        // role CRUD
        ...RolePermissions.permissionSet,
      ],
      description: '',
    },
  ]
  // ***

  // TODO check uniqueness of permission class set
  // TODO construct the permission tree that determines the hierrachy

  export interface DefaultRole {
    name: string
    description: string
    permission_groups: PermissionGroupNames[]
  }

  export const defaultRoles: DefaultRole[] = [
    {
      name: 'admin',
      description: 'Have access to all functionality.',
      permission_groups: ['admin', 'human resource'],
    },
  ]
}
