export namespace RolePermissions {
  const _permissionSet = [
    'get_roles',
    'get_role',
    'create_role',
    'update_role',
    'delete_role',
  ] as const

  type controllers = typeof _permissionSet[number]
  export type Permissions = `role.${controllers}`
  export const permissionSet = _permissionSet.map(
    (controller_permission) => `role.${controller_permission}` as Permissions
  )
  // TODO check uniqueness of permission set
}
