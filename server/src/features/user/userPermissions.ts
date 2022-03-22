export namespace UserPermissions {
  const _permissionSet = [
    'get_worker',
    'get_workers',
    'create_worker',
    'update_worker',
    'update_worker',
    'delete_worker',
  ] as const

  type controllers = typeof _permissionSet[number]
  export type Permissions = `user.${controllers}`
  export const permissionSet = _permissionSet.map(
    (controller_permission) => `user.${controller_permission}` as Permissions
  )
  // TODO check uniqueness of permission set
}
