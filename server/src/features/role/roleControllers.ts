import { RequestHandler } from 'express'
import { avjErrorWrapper } from '../../utils/ajv'
import ErrorResponse from '../../utils/errorResponse'
import RoleModel from './roleModels'
import { RoleIO } from './roleHandlerIO'

const { GetRoles, GetRole } = RoleIO

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
  }
}
