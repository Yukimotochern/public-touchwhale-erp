import errorCatcher from '../errorCatcher'
import CustomError from '../../utils/CustomError'
import { TwPermissons } from './permissionType'
import UserModel from '../../features/user/userModel'
const { permissionGroupSet } = TwPermissons

export const permission = (requiredPermissions: TwPermissons.Permissions[]) =>
  errorCatcher(async (req, res, next) => {
    if (req.userJWT) {
      const { isOwner, id } = req.userJWT
      if (isOwner) {
        return next()
      }
      const user = await UserModel.findById(id)
      if (!user || !user.permission_groups)
        return next(new CustomError('Invalid user.'))
      const totalPermissions = user.permission_groups.reduce((prev, curr) => {
        const permissionsInGroup = permissionGroupSet.find(
          (ob) => ob.name === curr
        )
        if (permissionsInGroup) {
          return prev.concat(permissionsInGroup.permissions)
        }
        return prev
      }, <TwPermissons.Permissions[]>[])
      if (requiredPermissions.every((rp) => totalPermissions.includes(rp))) {
        next()
      } else {
        return next(new CustomError('UnAuthorized', 403))
      }
    }
    return next(
      new CustomError(
        'Permission middleware should only be added after auth middleware.'
      )
    )
  })
