"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.createRole = exports.getRole = exports.getRoles = void 0;
var ajv_1 = require("../../utils/ajv");
var errorResponse_1 = __importDefault(require("../../utils/errorResponse"));
var roleModels_1 = __importDefault(require("./roleModels"));
var roleHandlerIO_1 = require("./roleHandlerIO");
var userModel_1 = __importDefault(require("../user/userModel"));
var GetRoles = roleHandlerIO_1.RoleIO.GetRoles, GetRole = roleHandlerIO_1.RoleIO.GetRole, CreateRole = roleHandlerIO_1.RoleIO.CreateRole, UpdateRole = roleHandlerIO_1.RoleIO.UpdateRole, DeleteRole = roleHandlerIO_1.RoleIO.DeleteRole;
// @route    GET api/v1/roles
// @desc     Get all created and default(TODO) roles
// @access   Private
var getRoles = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var roles;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!((_a = req.userJWT) === null || _a === void 0 ? void 0 : _a.owner)) return [3 /*break*/, 2];
                return [4 /*yield*/, roleModels_1.default.find({ owner: req.userJWT.owner })];
            case 1:
                roles = _b.sent();
                return [2 /*return*/, GetRoles.sendData(res, roles)];
            case 2:
                next(new errorResponse_1.default('Internal Server error'));
                return [2 /*return*/];
        }
    });
}); };
exports.getRoles = getRoles;
// @route    GET api/v1/roles/:id
// @desc     Get a single role
// @access   Private
var getRole = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var role;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!((_a = req.userJWT) === null || _a === void 0 ? void 0 : _a.owner)) return [3 /*break*/, 2];
                return [4 /*yield*/, roleModels_1.default.findOne({
                        owner: req.userJWT.owner,
                        _id: req.params.id,
                    })];
            case 1:
                role = _b.sent();
                if (role) {
                    return [2 /*return*/, GetRole.sendData(res, role)];
                }
                next(new errorResponse_1.default('Internal Server error'));
                _b.label = 2;
            case 2:
                next(new errorResponse_1.default('Internal Server error'));
                return [2 /*return*/];
        }
    });
}); };
exports.getRole = getRole;
// @route    POST api/v1/roles
// @desc     Create an new role
// @access   Private
var createRole = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var role;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!((_a = req.userJWT) === null || _a === void 0 ? void 0 : _a.owner)) return [3 /*break*/, 3];
                if (!CreateRole.bodyValidator(req.body)) return [3 /*break*/, 2];
                return [4 /*yield*/, roleModels_1.default.create(__assign(__assign({}, req.body), { owner: req.userJWT.owner }))];
            case 1:
                role = _b.sent();
                if (role) {
                    return [2 /*return*/, CreateRole.sendData(res, role)];
                }
                next(new errorResponse_1.default('Internal Server error'));
                _b.label = 2;
            case 2:
                next((0, ajv_1.avjErrorWrapper)(CreateRole.bodyValidator.errors));
                _b.label = 3;
            case 3:
                next(new errorResponse_1.default('Internal Server error'));
                return [2 /*return*/];
        }
    });
}); };
exports.createRole = createRole;
// @route    PUT api/v1/roles/:id
// @desc     Update a role
// @access   Private
var updateRole = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, shouldCascade, updates, roleQuery, role, new_role, new_p_groups_1, old_p_groups_1, p_groups_to_add_1, p_groups_to_remove_1, users, userAffected, anyoneAffected, i, updatedRole;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!((_b = req.userJWT) === null || _b === void 0 ? void 0 : _b.owner)) return [3 /*break*/, 6];
                if (!UpdateRole.bodyValidator(req.body)) return [3 /*break*/, 5];
                _a = req.body, shouldCascade = _a.shouldCascade, updates = _a.updates;
                roleQuery = {
                    owner: req.userJWT.owner,
                    _id: req.params.id,
                };
                return [4 /*yield*/, roleModels_1.default.findOne(roleQuery)];
            case 1:
                role = _c.sent();
                if (!role) {
                    return [2 /*return*/, next(new errorResponse_1.default('Role not found.'))];
                }
                new_role = updates;
                new_p_groups_1 = new_role.permission_groups;
                if (!new_p_groups_1) return [3 /*break*/, 3];
                old_p_groups_1 = role.permission_groups;
                p_groups_to_add_1 = new_p_groups_1.filter(function (npg) { return !old_p_groups_1.includes(npg); });
                p_groups_to_remove_1 = old_p_groups_1.filter(function (opg) { return !new_p_groups_1.includes(opg); });
                if (!(p_groups_to_add_1.length !== 0 || p_groups_to_remove_1.length !== 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, userModel_1.default.find({
                        owner: req.userJWT.owner,
                        role: role._id,
                    })];
            case 2:
                users = _c.sent();
                if (users.length !== 0) {
                    userAffected = users
                        .map(function (user) {
                        var shouldAdd = [];
                        var shouldRemove = [];
                        if (user.permission_groups) {
                            shouldRemove = user.permission_groups.filter(function (permission_group) {
                                return p_groups_to_remove_1.includes(permission_group);
                            });
                            shouldAdd = p_groups_to_add_1.filter(function (permission_group) {
                                // below check is redundant but the type check is breaking ...
                                return user.permission_groups
                                    ? !user.permission_groups.includes(permission_group)
                                    : true;
                            });
                        }
                        else {
                            shouldAdd = p_groups_to_add_1;
                            shouldRemove = p_groups_to_remove_1;
                        }
                        if (shouldAdd.length !== 0 || shouldRemove.length !== 0) {
                            if (user.permission_groups) {
                                user.permission_groups = user.permission_groups
                                    .filter(function (pg) { return !shouldRemove.includes(pg); })
                                    .concat(shouldAdd);
                            }
                            else {
                                user.permission_groups = shouldAdd;
                            }
                        }
                        return {
                            user: user,
                            shouldAdd: shouldAdd,
                            shouldRemove: shouldRemove,
                        };
                    })
                        .filter(function (ua) {
                        return ua.shouldAdd.length !== 0 || ua.shouldRemove.length !== 0;
                    });
                    anyoneAffected = userAffected.length !== 0;
                    if (anyoneAffected && !shouldCascade) {
                        return [2 /*return*/, UpdateRole.sendData(res, {
                                isUpdateDone: false,
                                userAffected: userAffected,
                            })];
                    }
                    if (anyoneAffected && shouldCascade) {
                        // cascade
                        for (i = 0; i < userAffected.length; i++) {
                            userAffected[i].user.save();
                        }
                    }
                }
                _c.label = 3;
            case 3: return [4 /*yield*/, roleModels_1.default.findByIdAndUpdate(roleQuery, new_role, {
                    runValidators: true,
                    new: true,
                })];
            case 4:
                updatedRole = _c.sent();
                if (updatedRole) {
                    return [2 /*return*/, UpdateRole.sendData(res, {
                            isUpdateDone: true,
                            updatedRole: updatedRole,
                        })];
                }
                return [2 /*return*/, next(new errorResponse_1.default('Role not found.'))];
            case 5:
                next((0, ajv_1.avjErrorWrapper)(UpdateRole.bodyValidator.errors));
                _c.label = 6;
            case 6:
                next(new errorResponse_1.default('Internal Server error'));
                return [2 /*return*/];
        }
    });
}); };
exports.updateRole = updateRole;
// @route    DELETE api/v1/roles/:id
// @desc     Delete a role
// @access   Private
var deleteRole = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var role, users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.userJWT) return [3 /*break*/, 4];
                return [4 /*yield*/, roleModels_1.default.findOne({
                        owner: req.userJWT.owner,
                        _id: req.params.id,
                    })];
            case 1:
                role = _a.sent();
                if (!role) {
                    return [2 /*return*/, next(new errorResponse_1.default('Role not found.'))];
                }
                return [4 /*yield*/, userModel_1.default.find({
                        owner: req.userJWT.owner,
                        role: role._id,
                    })];
            case 2:
                users = _a.sent();
                if (users.length !== 0) {
                    return [2 /*return*/, DeleteRole.sendData(res, {
                            deleted: false,
                            usersOfThisRole: users,
                        })];
                }
                return [4 /*yield*/, role.delete()];
            case 3:
                _a.sent();
                return [2 /*return*/, DeleteRole.sendData(res, {
                        deleted: true,
                        deletedRole: role,
                    })];
            case 4:
                next(new errorResponse_1.default('Internal Server error'));
                return [2 /*return*/];
        }
    });
}); };
exports.deleteRole = deleteRole;
