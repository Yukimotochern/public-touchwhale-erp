export namespace UserPermissions {
  const _permissionSet = [
    // These are reserved for system.
    // These can be public or open for all login users with correct status, like isActive, isOwner, ... etc.
    // This means that they should not be included in the permission consideration.
    // 'sign_up',
    // 'verify',
    // 'sign_in',
    // 'oauth_callback',
    // 'sign_out',
    // 'get_user',
    // 'update',
    // 'get_avatar_upload_url',
    // 'delete_avatar',
    // 'change_password',
    // 'forget_password',
    // 'reset_password',
    // Below are HR permission
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
