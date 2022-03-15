"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var roleControllers_1 = require("./roleControllers");
// Middleware
var authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
var errorCatcher_1 = __importDefault(require("../../middlewares/errorCatcher"));
var router = express_1.default.Router();
router.route('/').get(authMiddleware_1.default, (0, errorCatcher_1.default)(roleControllers_1.getRoles));
exports.default = router;
