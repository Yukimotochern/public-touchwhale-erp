"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var userControllers_1 = require("./userControllers");
// Middleware
var authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
var errorCatcher_1 = __importDefault(require("../../middlewares/errorCatcher"));
var permissionMiddleware_1 = require("../../middlewares/permission/permissionMiddleware");
var router = express_1.default.Router();
router.route('/signUp').post((0, errorCatcher_1.default)(userControllers_1.userSignUp));
router.route('/signUp/verify').post((0, errorCatcher_1.default)(userControllers_1.userVerify));
router.route('/signIn').post((0, errorCatcher_1.default)(userControllers_1.userSignIn));
router.route('/signUp/setPassword').post(authMiddleware_1.default, (0, errorCatcher_1.default)(userControllers_1.changePassword)); // Use changePassword to implement new user setPassword
router
    .route('/googleOAuth')
    .get(passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.route('/googleOAuth/callback').get(passport_1.default.authenticate('google', {
    failureRedirect: process.env.NODE_ENV === 'production'
        ? '/signIn'
        : "".concat(process.env.FRONTEND_DEV_URL, "signIN"),
}), //failureRedirect need to be changed
(0, errorCatcher_1.default)(userControllers_1.userOAuthCallback));
router.route('/signOut').get((0, errorCatcher_1.default)(userControllers_1.userSignOut));
router
    .route('/')
    .get(authMiddleware_1.default, (0, errorCatcher_1.default)(userControllers_1.getUser))
    .put(authMiddleware_1.default, (0, errorCatcher_1.default)(userControllers_1.updateUser));
router
    .route('/avatar')
    .get(authMiddleware_1.default, (0, errorCatcher_1.default)(userControllers_1.userGetAvatarUploadUrl))
    .delete(authMiddleware_1.default, (0, errorCatcher_1.default)(userControllers_1.deleteAvatar));
router.route('/changePassword').put(authMiddleware_1.default, (0, errorCatcher_1.default)(userControllers_1.changePassword));
router
    .route('/forgetPassword')
    .post((0, errorCatcher_1.default)(userControllers_1.forgetPassword))
    .put((0, errorCatcher_1.default)(userControllers_1.resetPassword));
router
    .route('/workers')
    .all(authMiddleware_1.default)
    .get((0, permissionMiddleware_1.permission)(['user.get_workers']), userControllers_1.getWorkers);
router
    .route('/workers/:id')
    .all(authMiddleware_1.default)
    .get((0, permissionMiddleware_1.permission)(['user.get_worker']), userControllers_1.getWorker)
    .post((0, permissionMiddleware_1.permission)(['user.create_worker']), userControllers_1.createWorker)
    .put((0, permissionMiddleware_1.permission)(['user.update_worker']), userControllers_1.updateWorker)
    .delete((0, permissionMiddleware_1.permission)(['user.delete_worker']), userControllers_1.deleteWorker);
exports.default = router;
