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
exports.resetPassword = exports.forgetPassword = exports.changePassword = exports.deleteAvatar = exports.userGetAvatarUploadUrl = exports.updateUser = exports.getUser = exports.userSignOut = exports.userOAuthCallback = exports.userSignIn = exports.userVerify = exports.userSignUp = void 0;
var crypto_1 = __importDefault(require("crypto"));
var sendEmail_1 = require("../../utils/sendEmail");
var ajv_1 = require("../../utils/ajv");
var errorResponse_1 = __importDefault(require("../../utils/errorResponse"));
var userModel_1 = __importDefault(require("./userModel"));
var emailMessage_1 = require("../../utils/emailMessage");
var b2_1 = require("../../utils/AWS/b2");
var userHandlerIO_1 = require("./userHandlerIO");
var apiIO_1 = require("../apiIO");
var SignUp = userHandlerIO_1.UserIO.SignUp, Verify = userHandlerIO_1.UserIO.Verify, SignIn = userHandlerIO_1.UserIO.SignIn, GetUser = userHandlerIO_1.UserIO.GetUser, Update = userHandlerIO_1.UserIO.Update, GetAvatarUploadUrl = userHandlerIO_1.UserIO.GetAvatarUploadUrl, ChangePassword = userHandlerIO_1.UserIO.ChangePassword, ForgetPassword = userHandlerIO_1.UserIO.ForgetPassword, ResetPassword = userHandlerIO_1.UserIO.ResetPassword;
var UserAvatarKeyPrifix = 'UserAvatar';
// @route    POST api/v1/user/signUp
// @desc     Sign user up
// @access   Public
var userSignUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, sixDigits, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!SignUp.bodyValidator(req.body)) return [3 /*break*/, 4];
                email = req.body.email;
                return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                sixDigits = Math.floor(100000 + Math.random() * 900000).toString();
                if (user) {
                    if (user.isActive) {
                        // User already register and has been activated
                        return [2 /*return*/, next(new errorResponse_1.default('User already exists.', 409))];
                    }
                    else {
                        // User already register but is not activated
                        user.password = sixDigits;
                    }
                }
                else {
                    user = new userModel_1.default({
                        email: email,
                        password: sixDigits,
                        provider: 'TouchWhale',
                        isOwner: true,
                        isActive: false,
                    });
                }
                return [4 /*yield*/, user.save({ validateBeforeSave: false })];
            case 2:
                _a.sent();
                message = (0, emailMessage_1.sixDigitsMessage)({ sixDigits: sixDigits });
                return [4 /*yield*/, (0, sendEmail_1.sendEmail)({
                        to: email,
                        subject: 'Your verificatiom code',
                        message: message,
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, SignUp.send(res, 200, {
                        message: "Verification code has been send to ".concat(email),
                    })];
            case 4:
                next((0, ajv_1.avjErrorWrapper)(SignUp.bodyValidator.errors));
                return [2 /*return*/];
        }
    });
}); };
exports.userSignUp = userSignUp;
// @route    POST api/v1/user/signUp/verify
// @desc     Verify user email
// @access   Public
var userVerify = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!Verify.bodyValidator(req.body)) return [3 /*break*/, 3];
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, userModel_1.default.findOne({ email: email }).select('+password')];
            case 1:
                user = _b.sent();
                if (!user || user.isActive) {
                    return [2 /*return*/, next(new errorResponse_1.default('User email is invalid.', 401))];
                }
                return [4 /*yield*/, user.matchPassword(password)];
            case 2:
                isMatch = _b.sent();
                if (!isMatch) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid credentials.', 401))];
                }
                return [2 /*return*/, Verify.sendData(res, user.getSignedJWTToken())];
            case 3:
                next((0, ajv_1.avjErrorWrapper)(Verify.bodyValidator.errors));
                return [2 /*return*/];
        }
    });
}); };
exports.userVerify = userVerify;
// @route    POST api/v1/user/signIn
// @desc     Sign user in
// @access   Public
var userSignIn = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, login_name, password, user, isMatch;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!SignIn.bodyValidator(req.body)) return [3 /*break*/, 3];
                _a = req.body, email = _a.email, login_name = _a.login_name, password = _a.password;
                if (!email && !login_name) {
                    return [2 /*return*/, next(new errorResponse_1.default('Without Identity.', 400))];
                }
                return [4 /*yield*/, userModel_1.default.findOne({ login_name: login_name, email: email }).select('+password')];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid credentials.', 401))];
                }
                if (user.isActive) {
                    return [2 /*return*/, next(new errorResponse_1.default('Your have not completed the sign up process. Please sign up again.', 400))];
                }
                return [4 /*yield*/, user.matchPassword(password)];
            case 2:
                isMatch = _b.sent();
                if (!isMatch) {
                    if (user.provider === 'Google') {
                        return [2 /*return*/, next(new errorResponse_1.default('You were registered with Google. Please try that login method.', 401))];
                    }
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid credentials.', 401))];
                }
                return [2 /*return*/, sendTokenResponse(user, 200, res)];
            case 3:
                next((0, ajv_1.avjErrorWrapper)(SignIn.bodyValidator.errors));
                return [2 /*return*/];
        }
    });
}); };
exports.userSignIn = userSignIn;
// @route    GET api/v1/user/googleOAuth/callback
// @desc     Call back function for Google OAuth
// @access   Public
var userOAuthCallback = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var redirectHome, profile, email, user, err_1, message, signInPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                redirectHome = process.env.BACKEND_PROD_URL;
                if (process.env.NODE_ENV === 'development') {
                    redirectHome = "".concat(process.env.FRONTEND_DEV_URL);
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                if (!req.user) return [3 /*break*/, 7];
                profile = req.user._json;
                email = profile.email;
                if (!email) {
                    throw new errorResponse_1.default('Unable to obtain the required information(email) from Google.');
                }
                return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
            case 2:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 4];
                user = new userModel_1.default({
                    isActive: true,
                    isOwner: true,
                    email: profile === null || profile === void 0 ? void 0 : profile.email,
                    password: crypto_1.default.randomBytes(10).toString('hex'),
                    avatar: profile === null || profile === void 0 ? void 0 : profile.picture,
                    provider: 'Google',
                    username: profile === null || profile === void 0 ? void 0 : profile.name,
                    active: true,
                });
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4:
                if (!(user.provider !== 'Google')) return [3 /*break*/, 6];
                user.provider = 'Google';
                return [4 /*yield*/, user.save()];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                setToken(user, res);
                return [2 /*return*/, res.redirect(redirectHome)];
            case 7: throw new errorResponse_1.default('Did not obtain information from Google.');
            case 8: return [3 /*break*/, 10];
            case 9:
                err_1 = _a.sent();
                message = 'Something went wrong.';
                if (err_1 instanceof errorResponse_1.default) {
                    message = err_1.message;
                }
                message = encodeURI("".concat(message, " Please try again latter or use the password login method."));
                signInPath = "".concat(redirectHome, "/signIn#").concat(message);
                return [2 /*return*/, res.redirect(signInPath)];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.userOAuthCallback = userOAuthCallback;
// @route    GET api/v1/user/signOut
// @desc     Sign user out
// @access   Public
var userSignOut = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.clearCookie('token', {
            path: '/',
            domain: process.env.NODE_ENV === 'development'
                ? process.env.DEV_DOMAIN
                : process.env.PROD_DOMAIN,
            httpOnly: true,
        });
        res.clearCookie('token', {
            path: '/',
            domain: '127.0.0.1',
            httpOnly: true,
        });
        res.end();
        return [2 /*return*/];
    });
}); };
exports.userSignOut = userSignOut;
// @route    GET api/v1/user/
// @desc     Get user infomation
// @access   Private
var getUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.userJWT) return [3 /*break*/, 2];
                return [4 /*yield*/, userModel_1.default.findById(req.userJWT.id)];
            case 1:
                user = _a.sent();
                if (user) {
                    return [2 /*return*/, GetUser.sendData(res, user)];
                }
                else {
                    return [2 /*return*/, next(new errorResponse_1.default('Server Error'))];
                }
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, next(new errorResponse_1.default('Server Error'))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
// @route    PUT api/v1/user/
// @desc     Update user infomation
// @access   Private
var updateUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!Update.bodyValidator(req.body)) return [3 /*break*/, 4];
                if (!req.userJWT) return [3 /*break*/, 2];
                return [4 /*yield*/, userModel_1.default.findByIdAndUpdate(req.userJWT.id, req.body, {
                        new: true,
                        runValidators: true,
                    })];
            case 1:
                user = _a.sent();
                if (user) {
                    return [2 /*return*/, Update.sendData(res, user)];
                }
                return [2 /*return*/, next(new errorResponse_1.default('Server Error'))];
            case 2: return [2 /*return*/, next(new errorResponse_1.default('Server Error'))];
            case 3: return [3 /*break*/, 5];
            case 4: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(Update.bodyValidator.errors))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
// @route    GET api/v1/user/avatar
// @desc     Get B2 url for frontend to make a put request
// @access   Private
var userGetAvatarUploadUrl = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, _a, Key, url, avatar;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!((_b = req.userJWT) === null || _b === void 0 ? void 0 : _b.id)) return [3 /*break*/, 4];
                id = req.userJWT.id;
                return [4 /*yield*/, userModel_1.default.findById(id)];
            case 1:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.default('Server Error.'))];
                }
                return [4 /*yield*/, (0, b2_1.uploadImage)(UserAvatarKeyPrifix, id)];
            case 2:
                _a = _c.sent(), Key = _a.Key, url = _a.url;
                avatar = "https://tw-user-data.s3.us-west-000.backblazeb2.com/".concat(Key);
                user.avatar = avatar;
                return [4 /*yield*/, user.save()];
            case 3:
                _c.sent();
                return [2 /*return*/, GetAvatarUploadUrl.sendData(res, { uploadUrl: url, avatar: avatar })];
            case 4: return [2 /*return*/, next(new errorResponse_1.default('Server Error', 500))];
        }
    });
}); };
exports.userGetAvatarUploadUrl = userGetAvatarUploadUrl;
// @route    DELETE api/v1/user/avatar
// @desc     DELET User Avatar
// @access   Private
var deleteAvatar = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!((_a = req.userJWT) === null || _a === void 0 ? void 0 : _a.id)) return [3 /*break*/, 4];
                id = req.userJWT.id;
                return [4 /*yield*/, userModel_1.default.findById(id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.default('Server Error.'))];
                }
                return [4 /*yield*/, (0, b2_1.deleteImage)(UserAvatarKeyPrifix, id)];
            case 2:
                _b.sent();
                user.avatar = undefined;
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                return [2 /*return*/, apiIO_1.HandlerIO.send(res, 200, { message: 'Avatar deleted.' })];
            case 4: return [2 /*return*/, next(new errorResponse_1.default('Server Error', 500))];
        }
    });
}); };
exports.deleteAvatar = deleteAvatar;
// @route    PUT api/v1/user/changePassword
// @desc     Update password
// @access   Private
var changePassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(ChangePassword.bodyValidator(req.body) && req.userJWT)) return [3 /*break*/, 7];
                return [4 /*yield*/, userModel_1.default.findById(req.userJWT.id).select('+password')];
            case 1:
                user = _a.sent();
                if (!(user && user.isActive && req.body.currentPassword)) return [3 /*break*/, 4];
                return [4 /*yield*/, user.matchPassword(req.body.currentPassword)];
            case 2:
                if (!(_a.sent())) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid credential.', 400))];
                }
                user.password = req.body.newPassword;
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                return [2 /*return*/, sendTokenResponse(user, 200, res)];
            case 4:
                if (!(user && !user.isActive)) return [3 /*break*/, 6];
                user.password = req.body.newPassword;
                user.isActive = true;
                return [4 /*yield*/, user.save()];
            case 5:
                _a.sent();
                return [2 /*return*/, sendTokenResponse(user, 200, res)];
            case 6: return [2 /*return*/, next(new errorResponse_1.default('Server Error'))];
            case 7: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(ChangePassword.bodyValidator.errors))];
        }
    });
}); };
exports.changePassword = changePassword;
// @route    POST api/v1/regularUser/forgetPassword
// @desc     Forget password
// @access   Public
var forgetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, option, message, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ForgetPassword.bodyValidator(req.body)) return [3 /*break*/, 8];
                return [4 /*yield*/, userModel_1.default.findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.default('There is no user with that email.', 404))];
                }
                token = user.getForgetPasswordToken();
                return [4 /*yield*/, user.save({ validateBeforeSave: false })
                    // Create url
                ];
            case 2:
                _a.sent();
                option = {
                    protocol: req.protocol,
                    host: req.get('host'),
                    token: token,
                };
                message = (0, emailMessage_1.forgetPasswordMessage)(option);
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 7]);
                return [4 /*yield*/, (0, sendEmail_1.sendEmail)({
                        to: req.body.email,
                        subject: 'Password reset token',
                        message: message,
                    })];
            case 4:
                _a.sent();
                ForgetPassword.send(res, 200, { message: 'Email sent' });
                return [3 /*break*/, 7];
            case 5:
                err_2 = _a.sent();
                console.error(err_2);
                user.forgetPasswordToken = undefined;
                user.forgetPasswordExpire = undefined;
                return [4 /*yield*/, user.save({ validateBeforeSave: false })];
            case 6:
                _a.sent();
                return [2 /*return*/, next(new errorResponse_1.default('Email could not be sent.', 500, err_2))];
            case 7: return [3 /*break*/, 9];
            case 8: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(ForgetPassword.bodyValidator.errors))];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.forgetPassword = forgetPassword;
// @desc        Reset password
// @route       PUT /api/v1/user/forgetPassword
// @access      Public
var resetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var forgetPasswordToken, user, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ResetPassword.bodyValidator(req.body)) return [3 /*break*/, 6];
                forgetPasswordToken = crypto_1.default
                    .createHash('sha256')
                    .update(req.body.token)
                    .digest('hex');
                return [4 /*yield*/, userModel_1.default.findOne({
                        forgetPasswordToken: forgetPasswordToken,
                        forgetPasswordExpire: { $gt: Date.now() },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid token.', 400))];
                }
                if (!req.body.password) return [3 /*break*/, 3];
                user.password = req.body.password;
                user.forgetPasswordToken = undefined;
                user.forgetPasswordExpire = undefined;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, ResetPassword.sendData(res, {}, { message: 'Your password has been set.' })];
            case 3:
                token = user.getForgetPasswordToken();
                return [4 /*yield*/, user.save({ validateBeforeSave: false })];
            case 4:
                _a.sent();
                return [2 /*return*/, ResetPassword.sendData(res, { token: token }, { message: 'Please use this new token to reset the password.' })];
            case 5: return [3 /*break*/, 7];
            case 6: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(ResetPassword.bodyValidator.errors))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
/*
// @route    POST api/v1/user/
// @desc
// @access   Public
export const userXXX: RequestHandler = async (req, res, next) => {
  if (XXX.bodyValidator(req.body)) {
    // return send(res, {})
    // or
    // return XXX.sendData(res, {})
  }
  next(avjErrorWrapper(XXX.bodyValidator.errors))
}
*/
// Helper functions
var setToken = function (user, res) {
    var token = user.getSignedJWTToken();
    var options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000 * 24),
        httpOnly: true,
    };
    res.cookie('token', token, options);
    return token;
};
var sendTokenResponse = function (user, statusCode, res) {
    setToken(user, res);
    return apiIO_1.HandlerIO.send(res, statusCode);
};
