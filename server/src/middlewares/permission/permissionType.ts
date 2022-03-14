import { UserPermissions } from '../../features/user/userPermissions'

// To add a permission for feature:
// 1. include XXX.Permissions into Permissions
// 2. add the permission strings to relevant permission group in permissionGroup set
// 3. make sure the permission group resides somewhere in the permission tree

export namespace TwPermissons {
  // union of all the permissions to controllers
  export type Permissions = UserPermissions.Permissions
  export const permissionSet: Permissions[] = [...UserPermissions.permissionSet]
  // union of all the permission group
  export const permissionGroupNameSet = ['basic'] as const
  export type PermissionGroupNames = typeof permissionGroupNameSet[number]
  interface PermissionGroup {
    name: PermissionGroupNames
    permissions: Permissions[]
    description: string
  }
  export const permissionGroupSet: PermissionGroup[] = [
    {
      name: 'basic',
      permissions: [
        // user
      ],
      description: '',
    },
  ]
  // TODO check uniqueness of permission class set
  // TODO construct the permission tree
}
