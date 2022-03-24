"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = void 0;
const errorCatcher_1 = __importDefault(require("../errorCatcher"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const permissionType_1 = require("./permissionType");
const userModel_1 = __importDefault(require("../../features/user/userModel"));
const { permissionGroupSet } = permissionType_1.TwPermissons;
const permission = (requiredPermissions) => (0, errorCatcher_1.default)(async (req, res, next) => {
    if (req.userJWT) {
        const { isOwner, id } = req.userJWT;
        if (isOwner) {
            return next();
        }
        const user = await userModel_1.default.findById(id);
        if (!user || !user.permission_groups)
            return next(new CustomError_1.default('Invalid user.'));
        const totalPermissions = user.permission_groups.reduce((prev, curr) => {
            const permissionsInGroup = permissionGroupSet.find((ob) => ob.name === curr);
            if (permissionsInGroup) {
                return prev.concat(permissionsInGroup.permissions);
            }
            return prev;
        }, []);
        if (requiredPermissions.every((rp) => totalPermissions.includes(rp))) {
            next();
        }
        else {
            return next(new CustomError_1.default('UnAuthorized', 403));
        }
    }
    return next(new CustomError_1.default('Permission middleware should only be added after auth middleware.'));
});
exports.permission = permission;
