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
exports.resetPassword = exports.forgetPassword = exports.changePassword = exports.updateRegularUser = exports.getRegularUser = exports.regularUserSignOut = exports.regularUserSignIn = exports.regularUserSignUp = void 0;
var crypto_1 = __importDefault(require("crypto"));
var sendEmail_1 = require("../../utils/sendEmail");
var ajv_1 = require("../../utils/ajv");
var errorResponse_1 = __importDefault(require("../../utils/errorResponse"));
var userValidate_1 = require("./userValidate");
var RegularUser_1 = __importDefault(require("../../models/RegularUser"));
// @route    POST api/v1/regularuser/signUp
// @desc     Signup regularuser
// @access   Public
// RequestHandler is an easier way to set types, by Yuki
var regularUserSignUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, userValidate_1.signUpBodyValidator)(req.body)) return [3 /*break*/, 3];
                email = req.body.email;
                return [4 /*yield*/, RegularUser_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (user) {
                    return [2 /*return*/, next(new errorResponse_1.default('User already exists.', 409))];
                }
                // Since req.body has been strictly validate by ajv, we can plug it into query, by Yuki
                user = new RegularUser_1.default(req.body);
                return [4 /*yield*/, user.save()
                    // Return to avoid potentially latter execution, by Yuki
                ];
            case 2:
                _a.sent();
                // Return to avoid potentially latter execution, by Yuki
                return [2 /*return*/, sendTokenResponse(user, 200, res)];
            case 3: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(userValidate_1.signUpBodyValidator.errors))];
        }
    });
}); };
exports.regularUserSignUp = regularUserSignUp;
// @route    POST api/v1/regularuser/signIn
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
                if (!user) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid credentials.', 401))];
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
// @route    GET api/v1/regularuser/signOut
// @desc     Sign regularuser out
// @access   Private
var regularUserSignOut = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Using Clear Cookie seems to be a cleaner way
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
// @route    GET api/v1/regularuser/
// @desc     Get regularuser infomation
// @access   Private
var getRegularUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user) return [3 /*break*/, 2];
                return [4 /*yield*/, RegularUser_1.default.findById(req.user.id)];
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
// @route    PUT api/v1/regularuser/
// @desc     Update regularuser infomation
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
                if (!req.user) return [3 /*break*/, 2];
                return [4 /*yield*/, RegularUser_1.default.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
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
// @route    PUT api/v1/regularuser/changePassword
// @desc     Update password
// @access   Private
var changePassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!((0, userValidate_1.changePasswordBodyValidator)(req.body) && req.user)) return [3 /*break*/, 5];
                if (!req.user) return [3 /*break*/, 4];
                return [4 /*yield*/, RegularUser_1.default.findById(req.user.id).select('+password')];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
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
            case 4: return [2 /*return*/, next(new errorResponse_1.default('Server Error'))];
            case 5: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(userValidate_1.changePasswordBodyValidator.errors))];
        }
    });
}); };
exports.changePassword = changePassword;
// @route    POST api/v1/regularuser/forgetPassword
// @desc     Forget password
// @access   Public
var forgetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, resetUrl, message, err_1;
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
                resetUrl = "".concat(req.protocol, "://").concat(req.get('host'), "/api/v1/user/forgetpassword/").concat(token);
                message = "Make a PUT request to: \n ".concat(resetUrl);
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
                err_1 = _a.sent();
                console.log(err_1);
                user.forgetPasswordToken = undefined;
                user.forgetPasswordExpire = undefined;
                return [4 /*yield*/, user.save({ validateBeforeSave: false })];
            case 6:
                _a.sent();
                return [2 /*return*/, next(new errorResponse_1.default('Email could not be sent.', 500, err_1))];
            case 7: return [3 /*break*/, 9];
            case 8: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(userValidate_1.forgetPasswordBodyValidator.errors))];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.forgetPassword = forgetPassword;
// @desc        Reset password
// @route       PUT /api/v1/regularuser/forgetPassword/:resetToken
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
// Helper function
var sendTokenResponse = function (user, statusCode, res) {
    var token = user.getSignedJWTToken();
    var options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000),
        httpOnly: true,
    };
    res.status(statusCode).cookie('token', token, options).json({ token: token });
};
