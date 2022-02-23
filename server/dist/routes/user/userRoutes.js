"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userController_1 = require("./userController");
var router = express_1.default.Router();
router.route('/signup').post(userController_1.usersignup);
router.route('/signin').post(userController_1.userSignin);
router.route('/').get(userController_1.getUser).put(userController_1.updateUser);
router.route('/resetpassword').put(userController_1.resetpassword);
exports.default = router;
