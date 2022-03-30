"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.createRole = exports.getRole = exports.getRoles = void 0;
const ajv_1 = require("api/dist/utils/ajv");
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const roleModels_1 = __importDefault(require("./roleModels"));
const roleApi_1 = require("api/dist/role/roleApi");
const userModel_1 = __importDefault(require("../user/userModel"));
// @route    GET api/v1/roles
// @desc     Get all created and default(TODO) roles
// @access   Private
const getRoles = async (req, res, next) => {
    if (req.userJWT?.owner) {
        const roles = await roleModels_1.default.find({ owner: req.userJWT.owner });
        return roleApi_1.GetRoles.API.sendData(res, roles);
    }
    next(new CustomError_1.default('Internal Server error'));
};
exports.getRoles = getRoles;
// @route    GET api/v1/roles/:id
// @desc     Get a single role
// @access   Private
const getRole = async (req, res, next) => {
    if (req.userJWT?.owner) {
        const role = await roleModels_1.default.findOne({
            owner: req.userJWT.owner,
            _id: req.params.id,
        });
        if (role) {
            return roleApi_1.GetRole.API.sendData(res, role);
        }
        next(new CustomError_1.default('Internal Server error'));
    }
    next(new CustomError_1.default('Internal Server error'));
};
exports.getRole = getRole;
// @route    POST api/v1/roles
// @desc     Create an new role
// @access   Private
const createRole = async (req, res, next) => {
    if (req.userJWT?.owner) {
        if (roleApi_1.CreateRole.API.bodyValidator(req.body)) {
            // TODO should check that if the tree like hierrachy is complied with
            const role = await roleModels_1.default.create({
                ...req.body,
                owner: req.userJWT.owner,
            });
            if (role) {
                return roleApi_1.CreateRole.API.sendData(res, role);
            }
            next(new CustomError_1.default('Internal Server error'));
        }
        next((0, ajv_1.avjErrorWrapper)(roleApi_1.CreateRole.API.bodyValidator.errors));
    }
    next(new CustomError_1.default('Internal Server error'));
};
exports.createRole = createRole;
// @route    PUT api/v1/roles/:id
// @desc     Update a role
// @access   Private
const updateRole = async (req, res, next) => {
    if (req.userJWT?.owner) {
        if (roleApi_1.UpdateRole.API.bodyValidator(req.body)) {
            const { shouldCascade, updates } = req.body;
            const roleQuery = {
                owner: req.userJWT.owner,
                _id: req.params.id,
            };
            const role = await roleModels_1.default.findOne(roleQuery);
            if (!role) {
                return next(new CustomError_1.default('Role not found.'));
            }
            const new_role = updates;
            const new_p_groups = new_role.permission_groups;
            // check if new permission groups are provided
            if (new_p_groups) {
                const old_p_groups = role.permission_groups;
                // see updates
                let p_groups_to_add = new_p_groups.filter((npg) => !old_p_groups.includes(npg));
                let p_groups_to_remove = old_p_groups.filter((opg) => !new_p_groups.includes(opg));
                // see if different from old one
                if (p_groups_to_add.length !== 0 || p_groups_to_remove.length !== 0) {
                    const users = await userModel_1.default.find({
                        owner: req.userJWT.owner,
                        role: role._id,
                    });
                    if (users.length !== 0) {
                        let userAffected = users
                            .map((user) => {
                            let shouldAdd = [];
                            let shouldRemove = [];
                            if (user.permission_groups) {
                                shouldRemove = user.permission_groups.filter((permission_group) => p_groups_to_remove.includes(permission_group));
                                shouldAdd = p_groups_to_add.filter((permission_group) => 
                                // below check is redundant but the type check is breaking ...
                                user.permission_groups
                                    ? !user.permission_groups.includes(permission_group)
                                    : true);
                            }
                            else {
                                shouldAdd = p_groups_to_add;
                                shouldRemove = p_groups_to_remove;
                            }
                            if (shouldAdd.length !== 0 || shouldRemove.length !== 0) {
                                if (user.permission_groups) {
                                    user.permission_groups = user.permission_groups
                                        .filter((pg) => !shouldRemove.includes(pg))
                                        .concat(shouldAdd);
                                }
                                else {
                                    user.permission_groups = shouldAdd;
                                }
                            }
                            return {
                                user,
                                shouldAdd,
                                shouldRemove,
                            };
                        })
                            .filter((ua) => ua.shouldAdd.length !== 0 || ua.shouldRemove.length !== 0);
                        let anyoneAffected = userAffected.length !== 0;
                        if (anyoneAffected && !shouldCascade) {
                            return roleApi_1.UpdateRole.API.sendData(res, {
                                isUpdateDone: false,
                                userAffected,
                            });
                        }
                        if (anyoneAffected && shouldCascade) {
                            // cascade
                            for (let i = 0; i < userAffected.length; i++) {
                                userAffected[i].user.save();
                            }
                        }
                    }
                    // update here
                }
            }
            // direct update
            const updatedRole = await roleModels_1.default.findByIdAndUpdate(roleQuery, new_role, {
                runValidators: true,
                new: true,
            });
            if (updatedRole) {
                return roleApi_1.UpdateRole.API.sendData(res, {
                    isUpdateDone: true,
                    updatedRole: updatedRole,
                });
            }
            return next(new CustomError_1.default('Role not found.'));
        }
        next((0, ajv_1.avjErrorWrapper)(roleApi_1.UpdateRole.API.bodyValidator.errors));
    }
    next(new CustomError_1.default('Internal Server error'));
};
exports.updateRole = updateRole;
// @route    DELETE api/v1/roles/:id
// @desc     Delete a role
// @access   Private
const deleteRole = async (req, res, next) => {
    if (req.userJWT) {
        // see if anyone being affected
        // return them and don't delete
        const role = await roleModels_1.default.findOne({
            owner: req.userJWT.owner,
            _id: req.params.id,
        });
        if (!role) {
            return next(new CustomError_1.default('Role not found.'));
        }
        const users = await userModel_1.default.find({
            owner: req.userJWT.owner,
            role: role._id,
        });
        if (users.length !== 0) {
            return roleApi_1.DeleteRole.API.sendData(res, {
                deleted: false,
                usersOfThisRole: users,
            });
        }
        await role.delete();
        return roleApi_1.DeleteRole.API.sendData(res, {
            deleted: true,
            deletedRole: role,
        });
    }
    next(new CustomError_1.default('Internal Server error'));
};
exports.deleteRole = deleteRole;
