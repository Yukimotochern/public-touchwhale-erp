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
const router = express_1.default.Router();
router.route('/').get(authMiddleware_1.default, (0, errorCatcher_1.default)(roleControllers_1.getRoles));
exports.default = router;
