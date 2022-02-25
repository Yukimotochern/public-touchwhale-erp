"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userController_1 = require("./userController");
// Middleware
var authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
var router = express_1.default.Router();
router.route('/signUp').post(userController_1.regualrUserSignUp);
router.route('/signIn').post(userController_1.regualrUserSignIn);
router.route('/signOut').get(authMiddleware_1.default, userController_1.regualrUserSignOut);
router
    .route('/')
    .get(authMiddleware_1.default, userController_1.getRegualrUser)
    .put(authMiddleware_1.default, userController_1.updateRegualrUser);
router.route('/changePassword').put(authMiddleware_1.default, userController_1.changePassword);
router.route('/forgetPassword').post(userController_1.forgetPassword);
router.route('/forgetPassword/:resetToken').put(userController_1.resetPassword);
exports.default = router;
