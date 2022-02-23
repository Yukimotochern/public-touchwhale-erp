"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userController_1 = require("./userController");
// Middleware
var authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
var validateMiddleware_1 = __importDefault(require("../../middleware/validateMiddleware"));
// Ajv Schema
var User_validate_1 = require("./User_validate");
var router = express_1.default.Router();
router.route('/signup').post((0, validateMiddleware_1.default)(User_validate_1.signup_validate), userController_1.usersignup);
router.route('/signin').post((0, validateMiddleware_1.default)(User_validate_1.signin_validate), userController_1.userSignin);
router.route('/signout').get(authMiddleware_1.default, userController_1.userSignout);
router
    .route('/')
    .get(authMiddleware_1.default, userController_1.getUser)
    .put([authMiddleware_1.default, (0, validateMiddleware_1.default)(User_validate_1.updateuser_validate)], userController_1.updateUser);
router
    .route('/changepassword')
    .put([authMiddleware_1.default, (0, validateMiddleware_1.default)(User_validate_1.changepassword_validate)], userController_1.changepassword);
router
    .route('/forgetpassword')
    .post((0, validateMiddleware_1.default)(User_validate_1.forgetpassword_validate), userController_1.forgetpassword);
router
    .route('/forgetpassword/:resettoken')
    .put((0, validateMiddleware_1.default)(User_validate_1.resetpassword_validate), userController_1.resetpassword);
exports.default = router;
