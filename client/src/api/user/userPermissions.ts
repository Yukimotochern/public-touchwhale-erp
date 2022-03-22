const _permissionSet = [
  'get_worker',
  'get_workers',
  'create_worker',
  'update_worker',
  'update_worker',
  'delete_worker',
] as const
type controllers = typeof _permissionSet[number]

// Change the `user. part !! in the next line
type Permissions = `user.${controllers}`
const permissionSet = _permissionSet.map(
  // Change the `user. part !! in the next line
  (controller_permission) => `user.${controller_permission}` as Permissions
)
// TODO check uniqueness of permission set

export { permissionSet as userPermissionSet }

export type { Permissions as UserPermissions }
