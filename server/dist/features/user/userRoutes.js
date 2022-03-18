"use strict";
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
router.route('/111').get((0, errorCatcher_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                setTimeout(function () {
                    console.log('Your work done.');
                    res.send('your res here');
                    resolve('foo');
                }, 5000);
            })];
    });
}); }));
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
