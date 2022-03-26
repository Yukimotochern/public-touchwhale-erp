"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roleControllers_1 = require("./roleControllers");
// Middleware
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const errorCatcher_1 = __importDefault(require("../../middlewares/errorCatcher"));
const permissionMiddleware_1 = require("../../middlewares/permissionMiddleware");
const router = express_1.default.Router();
router
    .route('/')
    .all(authMiddleware_1.default)
    .get((0, permissionMiddleware_1.permission)(['role.get_roles']), (0, errorCatcher_1.default)(roleControllers_1.getRoles))
    .post((0, permissionMiddleware_1.permission)(['role.create_role']), (0, errorCatcher_1.default)(roleControllers_1.createRole));
router
    .route('/:id')
    .all(authMiddleware_1.default)
    .get((0, permissionMiddleware_1.permission)(['role.get_role']), (0, errorCatcher_1.default)(roleControllers_1.getRole))
    .put((0, permissionMiddleware_1.permission)(['role.update_role']), (0, errorCatcher_1.default)(roleControllers_1.updateRole))
    .delete((0, permissionMiddleware_1.permission)(['role.delete_role']), (0, errorCatcher_1.default)(roleControllers_1.deleteRole));
exports.default = router;
