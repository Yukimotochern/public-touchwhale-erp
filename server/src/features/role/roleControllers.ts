import { RequestHandler } from 'express'
import { avjErrorWrapper } from '../../utils/ajv'
import ErrorResponse from '../../utils/errorResponse'
import RoleModel from './roleModels'
import { RoleIO } from './roleHandlerIO'
import UserModel from '../user/userModel'
import { TwPermissons } from '../../middlewares/permission/permissionType'

const { GetRoles, GetRole, CreateRole, UpdateRole, DeleteRole } = RoleIO

// @route    GET api/v1/roles
// @desc     Get all created and default(TODO) roles
// @access   Private
export const getRoles: RequestHandler = async (req, res, next) => {
  if (req.userJWT?.owner) {
    const roles = await RoleModel.find({ owner: req.userJWT.owner })
    return GetRoles.sendData(res, roles)
  }
  next(new ErrorResponse('Internal Server error'))
}

// @route    GET api/v1/roles/:id
// @desc     Get a single role
// @access   Private
export const getRole: RequestHandler = async (req, res, next) => {
  if (req.userJWT?.owner) {
    const role = await RoleModel.findOne({
      owner: req.userJWT.owner,
      _id: req.params.id,
    })
    if (role) {
      return GetRole.sendData(res, role)
    }
    next(new ErrorResponse('Internal Server error'))
  }
  next(new ErrorResponse('Internal Server error'))
}

// @route    POST api/v1/roles
// @desc     Create an new role
// @access   Private
export const createRole: RequestHandler = async (req, res, next) => {
  if (req.userJWT?.owner) {
    if (CreateRole.bodyValidator(req.body)) {
      // TODO should check that if the tree like hierrachy is complied with
      const role = await RoleModel.create({
        ...req.body,
        owner: req.userJWT.owner,
      })
      if (role) {
        return CreateRole.sendData(res, role)
      }
      next(new ErrorResponse('Internal Server error'))
    }
    next(avjErrorWrapper(CreateRole.bodyValidator.errors))
  }
  next(new ErrorResponse('Internal Server error'))
}

// @route    PUT api/v1/roles/:id
// @desc     Update a role
// @access   Private
export const updateRole: RequestHandler = async (req, res, next) => {
  if (req.userJWT?.owner) {
    if (UpdateRole.bodyValidator(req.body)) {
      const { shouldCascade, updates } = req.body
      const roleQuery = {
        owner: req.userJWT.owner,
        _id: req.params.id,
      }
      const role = await RoleModel.findOne(roleQuery)
      if (!role) {
        return next(new ErrorResponse('Role not found.'))
      }
      const new_role = updates
      const new_p_groups = new_role.permission_groups
      // check if new permission groups are provided
      if (new_p_groups) {
        const old_p_groups = role.permission_groups
        // see updates
        let p_groups_to_add = new_p_groups.filter(
          (npg) => !old_p_groups.includes(npg)
        )
        let p_groups_to_remove = old_p_groups.filter(
          (opg) => !new_p_groups.includes(opg)
        )
        // see if different from old one
        if (p_groups_to_add.length !== 0 || p_groups_to_remove.length !== 0) {
          const users = await UserModel.find({
            owner: req.userJWT.owner,
            role: role._id,
          })
          if (users.length !== 0) {
            let userAffected = users
              .map((user) => {
                let shouldAdd: TwPermissons.PermissionGroupNames[] = []
                let shouldRemove: TwPermissons.PermissionGroupNames[] = []
                if (user.permission_groups) {
                  shouldRemove = user.permission_groups.filter(
                    (permission_group) =>
                      p_groups_to_remove.includes(permission_group)
                  )
                  shouldAdd = p_groups_to_add.filter((permission_group) =>
                    // below check is redundant but the type check is breaking ...
                    user.permission_groups
                      ? !user.permission_groups.includes(permission_group)
                      : true
                  )
                } else {
                  shouldAdd = p_groups_to_add
                  shouldRemove = p_groups_to_remove
                }
                if (shouldAdd.length !== 0 || shouldRemove.length !== 0) {
                  if (user.permission_groups) {
                    user.permission_groups = user.permission_groups
                      .filter((pg) => !shouldRemove.includes(pg))
                      .concat(shouldAdd)
                  } else {
                    user.permission_groups = shouldAdd
                  }
                }
                return {
                  user,
                  shouldAdd,
                  shouldRemove,
                }
              })
              .filter(
                (ua) =>
                  ua.shouldAdd.length !== 0 || ua.shouldRemove.length !== 0
              )
            let anyoneAffected = userAffected.length !== 0
            if (anyoneAffected && !shouldCascade) {
              return UpdateRole.sendData(res, {
                isUpdateDone: false,
                userAffected,
              })
            }
            if (anyoneAffected && shouldCascade) {
              // cascade
              for (let i = 0; i < userAffected.length; i++) {
                userAffected[i].user.save()
              }
            }
          }
          // update here
        }
      }
      // direct update
      const updatedRole = await RoleModel.findByIdAndUpdate(
        roleQuery,
        new_role,
        {
          runValidators: true,
          new: true,
        }
      )
      if (updatedRole) {
        return UpdateRole.sendData(res, {
          isUpdateDone: true,
          updatedRole: updatedRole,
        })
      }
      return next(new ErrorResponse('Role not found.'))
    }
    next(avjErrorWrapper(UpdateRole.bodyValidator.errors))
  }
  next(new ErrorResponse('Internal Server error'))
}

// @route    DELETE api/v1/roles/:id
// @desc     Delete a role
// @access   Private
export const deleteRole: RequestHandler = async (req, res, next) => {
  if (req.userJWT) {
    // see if anyone being affected
    // return them and don't delete
    const role = await RoleModel.findOne({
      owner: req.userJWT.owner,
      _id: req.params.id,
    })
    if (!role) {
      return next(new ErrorResponse('Role not found.'))
    }
    const users = await UserModel.find({
      owner: req.userJWT.owner,
      role: role._id,
    })
    if (users.length !== 0) {
      return DeleteRole.sendData(res, {
        deleted: false,
        usersOfThisRole: users,
      })
    }
    await role.delete()
    return DeleteRole.sendData(res, {
      deleted: true,
      deletedRole: role,
    })
  }
  next(new ErrorResponse('Internal Server error'))
}
