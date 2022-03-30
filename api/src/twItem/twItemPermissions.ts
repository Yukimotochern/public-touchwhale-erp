const _permissionSet = [
  'get_items_with_detail',
  'get_items',
  'create_item',
  'get_item',
  'upload_img',
  'delete_img',
  'update_item',
  'delete_item',
] as const

type controllers = typeof _permissionSet[number]
export type Permissions = `tw_item.${controllers}`
export const permissionSet = _permissionSet.map(
  (controller_permission) => `tw_item.${controller_permission}` as Permissions
)
// TODO check uniqueness of permission set

export { permissionSet as twItemPermissionSet }
export type { Permissions as TwItemPermissions }
