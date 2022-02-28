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
exports.resetPassword = exports.forgetPassword = exports.changePassword = exports.setAvatar = exports.getB2URL = exports.updateRegularUser = exports.getRegularUser = exports.regularUserSignOut = exports.OAuthCallback = exports.regularUserSignIn = exports.regularUserVerify = exports.regularUserSignUp = void 0;
var crypto_1 = __importDefault(require("crypto"));
var sendEmail_1 = require("../../utils/sendEmail");
var ajv_1 = require("../../utils/ajv");
var errorResponse_1 = __importDefault(require("../../utils/errorResponse"));
var mongoose_1 = require("mongoose");
var userValidate_1 = require("./userValidate");
var RegularUser_1 = __importDefault(require("../../models/RegularUser"));
var emailMessage_1 = require("../../utils/emailMessage");
var uploadImage_1 = __importDefault(require("../../utils/AWS/uploadImage"));
// @route    POST api/v1/regularUser/signUp
// @desc     Signup regularuser
// @access   Public
var regularUserSignUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, sixDigits, err_1, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, userValidate_1.signUpBodyValidator)(req.body)) return [3 /*break*/, 7];
                email = req.body.email;
                return [4 /*yield*/, RegularUser_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (user && user.active) {
                    return [2 /*return*/, next(new errorResponse_1.default('User already exists.', 409))];
                }
                sixDigits = Math.floor(100000 + Math.random() * 900000).toString();
                user = new RegularUser_1.default({
                    email: email,
                    password: sixDigits,
                    provider: 'TouchWhale',
                });
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, user.save({ validateBeforeSave: false })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                if (err_1 instanceof mongoose_1.mongo.MongoServerError) {
                    if (err_1.code === 11000) {
                        console.log(err_1.message);
                        return [2 /*return*/, next(new errorResponse_1.default('Email has been taken.', 400))];
                    }
                }
                throw err_1;
            case 5:
                message = (0, emailMessage_1.sixDigitsMessage)({ sixDigits: sixDigits });
                return [4 /*yield*/, (0, sendEmail_1.sendEmail)({
                        to: email,
                        subject: 'Your verificatiom code',
                        message: message,
                    })];
            case 6:
                _a.sent();
                res
                    .status(200)
                    .json({ data: "Verification code has been send to ".concat(email) });
                return [3 /*break*/, 8];
            case 7: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(userValidate_1.signUpBodyValidator.errors))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.regularUserSignUp = regularUserSignUp;
// @route    POST api/v1/regularUser/signUp/verify
// @desc     New regularuser enter verification code
// @access   Public
var regularUserVerify = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, RegularUser_1.default.findOne({ email: email }).select('+password')];
            case 1:
                user = _b.sent();
                if (!user || user.active) {
                    return [2 /*return*/, next(new errorResponse_1.default('User email is invalid.', 401))];
                }
                return [4 /*yield*/, user.matchPassword(password)];
            case 2:
                isMatch = _b.sent();
                if (!isMatch) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid credentials.', 401))];
                }
                return [2 /*return*/, sendTokenResponse(user, 200, res)];
        }
    });
}); };
exports.regularUserVerify = regularUserVerify;
// @route    POST api/v1/regularUser/signIn or POST api/v1/regularUser/signUp/verify
// @desc     Sign regularuser in
// @access   Public
var regularUserSignIn = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(0, userValidate_1.signInBodyValidator)(req.body)) return [3 /*break*/, 3];
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, RegularUser_1.default.findOne({ email: email }).select('+password')];
            case 1:
                user = _b.sent();
                if (!user || !user.active) {
                    return [2 /*return*/, next(new errorResponse_1.default('User not found or maybe you have not been verified.', 404))];
                }
                return [4 /*yield*/, user.matchPassword(password)];
            case 2:
                isMatch = _b.sent();
                if (!isMatch) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid credentials.', 401))];
                }
                return [2 /*return*/, sendTokenResponse(user, 200, res)];
            case 3: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(userValidate_1.signInBodyValidator.errors))];
        }
    });
}); };
exports.regularUserSignIn = regularUserSignIn;
// @route    Google OAuth callback
// @desc     Call back function for google OAuth
// @access   Public
var OAuthCallback = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var profile, email, user, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!req.user) return [3 /*break*/, 6];
                profile = req.user._json;
                email = profile.email;
                return [4 /*yield*/, RegularUser_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 3];
                user = new RegularUser_1.default({
                    email: profile === null || profile === void 0 ? void 0 : profile.email,
                    password: crypto_1.default.randomBytes(10).toString('hex'),
                    avatar: profile === null || profile === void 0 ? void 0 : profile.picture,
                    provider: 'Google',
                });
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                if (!(user.provider !== 'Google')) return [3 /*break*/, 5];
                user.provider = 'Google';
                return [4 /*yield*/, user.save()];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                setToken(user, 200, res);
                return [2 /*return*/, res.redirect('/')];
            case 6: return [2 /*return*/, next(new errorResponse_1.default('Google Bad Request', 500))];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_2 = _a.sent();
                return [2 /*return*/, next(new errorResponse_1.default('Google Bad Request', 500, err_2))];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.OAuthCallback = OAuthCallback;
// @route    GET api/v1/regularUser/signOut
// @desc     Sign regularuser out
// @access   Private
var regularUserSignOut = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.clearCookie('token', {
            httpOnly: true,
        });
        res.status(200).json({
            data: {},
        });
        return [2 /*return*/];
    });
}); };
exports.regularUserSignOut = regularUserSignOut;
// @route    GET api/v1/regularUser/
// @desc     Get regularuser infomation
// @access   Private
var getRegularUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.userJWT) return [3 /*break*/, 2];
                return [4 /*yield*/, RegularUser_1.default.findById(req.userJWT.id)];
            case 1:
                user = _a.sent();
                if (user) {
                    res.status(200).json({
                        data: user,
                    });
                }
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, next(new errorResponse_1.default('Server Error'))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getRegularUser = getRegularUser;
// @route    PUT api/v1/regularUser/
// @desc     Update regularUser infomation
// @access   Private
var updateRegularUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var company_name, fieldsToUpdate, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, userValidate_1.updateRegularUserBodyValidator)(req.body)) return [3 /*break*/, 4];
                company_name = req.body.company_name;
                fieldsToUpdate = {
                    company_name: company_name,
                };
                if (!req.userJWT) return [3 /*break*/, 2];
                return [4 /*yield*/, RegularUser_1.default.findByIdAndUpdate(req.userJWT.id, fieldsToUpdate, {
                        new: true,
                        runValidators: true,
                    })];
            case 1:
                user = _a.sent();
                res.status(200).json({
                    data: user,
                });
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, next(new errorResponse_1.default('Server Error'))];
            case 3: return [3 /*break*/, 5];
            case 4: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(userValidate_1.updateRegularUserBodyValidator.errors))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateRegularUser = updateRegularUser;
// @route    GET api/v1/regularUser/uploadAvatar
// @desc     Get B2 url for frontend to make a put request
// @access   Private
var getB2URL = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!((_c = req.userJWT) === null || _c === void 0 ? void 0 : _c.id)) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid credentials.'))];
                }
                id = req.userJWT.id;
                _b = (_a = res.status(200)).send;
                return [4 /*yield*/, (0, uploadImage_1.default)(id)];
            case 1:
                _b.apply(_a, [_d.sent()]);
                return [2 /*return*/];
        }
    });
}); };
exports.getB2URL = getB2URL;
// @route    POST api/v1/regularUser/uploadAvatar
// @desc     Set imageKey in RegularUser
// @access   Private
var setAvatar = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, imgKey, user, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, id = _a.id, imgKey = _a.imgKey;
                return [4 /*yield*/, RegularUser_1.default.findById(id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.default('Server Error.'))];
                }
                user.avatar = imgKey;
                user.save();
                res.status(200).json({ id: user.id, imgKey: imgKey });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                return [2 /*return*/, next(new errorResponse_1.default('Server Error', 500, err_3))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.setAvatar = setAvatar;
// @route    PUT api/v1/regularUser/changePassword
// @desc     Update password
// @access   Private
var changePassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!((0, userValidate_1.changePasswordBodyValidator)(req.body) && req.userJWT)) return [3 /*break*/, 7];
                return [4 /*yield*/, RegularUser_1.default.findById(req.userJWT.id).select('+password')];
            case 1:
                user = _a.sent();
                if (!(user && user.active)) return [3 /*break*/, 4];
                return [4 /*yield*/, user.matchPassword(req.body.currentPassword)];
            case 2:
                if (!(_a.sent())) {
                    return [2 /*return*/, next(new errorResponse_1.default('Password is incorrect.', 400))];
                }
                user.password = req.body.newPassword;
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                return [2 /*return*/, sendTokenResponse(user, 200, res)];
            case 4:
                if (!(user && !user.active)) return [3 /*break*/, 6];
                user.password = req.body.newPassword;
                user.active = true;
                return [4 /*yield*/, user.save()];
            case 5:
                _a.sent();
                return [2 /*return*/, sendTokenResponse(user, 200, res)];
            case 6: return [2 /*return*/, next(new errorResponse_1.default('Server Error'))];
            case 7: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(userValidate_1.changePasswordBodyValidator.errors))];
        }
    });
}); };
exports.changePassword = changePassword;
// @route    POST api/v1/regularUser/forgetPassword
// @desc     Forget password
// @access   Public
var forgetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, option, message, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, userValidate_1.forgetPasswordBodyValidator)(req.body)) return [3 /*break*/, 8];
                return [4 /*yield*/, RegularUser_1.default.findOne({ email: req.body.email })];
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
                        to: user.email,
                        subject: 'Password reset token',
                        message: message,
                    })];
            case 4:
                _a.sent();
                res.status(200).json({ data: 'Email sent.' });
                return [3 /*break*/, 7];
            case 5:
                err_4 = _a.sent();
                console.log(err_4);
                user.forgetPasswordToken = undefined;
                user.forgetPasswordExpire = undefined;
                return [4 /*yield*/, user.save({ validateBeforeSave: false })];
            case 6:
                _a.sent();
                return [2 /*return*/, next(new errorResponse_1.default('Email could not be sent.', 500, err_4))];
            case 7: return [3 /*break*/, 9];
            case 8: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(userValidate_1.forgetPasswordBodyValidator.errors))];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.forgetPassword = forgetPassword;
// @desc        Reset password
// @route       PUT /api/v1/regularUser/forgetPassword/:resetToken
// @access      Public
var resetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var forgetPasswordToken, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, userValidate_1.resetPasswordBodyValidator)(req.body)) return [3 /*break*/, 3];
                forgetPasswordToken = crypto_1.default
                    .createHash('sha256')
                    .update(req.params.resetToken)
                    .digest('hex');
                return [4 /*yield*/, RegularUser_1.default.findOne({
                        forgetPasswordToken: forgetPasswordToken,
                        forgetPasswordExpire: { $gt: Date.now() },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid token.', 400))];
                }
                user.password = req.body.password;
                user.forgetPasswordToken = undefined;
                user.forgetPasswordExpire = undefined;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                res.status(200).json({ data: 'Your password has been set.' });
                return [3 /*break*/, 4];
            case 3: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(userValidate_1.resetPasswordBodyValidator.errors))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
// Helper functions
var setToken = function (user, statusCode, res) {
    var token = user.getSignedJWTToken();
    var options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000),
        httpOnly: true,
    };
    res.status(statusCode).cookie('token', token, options);
    return token;
};
var sendTokenResponse = function (user, statusCode, res) {
    var token = setToken(user, statusCode, res);
    res.json({ token: token });
};
