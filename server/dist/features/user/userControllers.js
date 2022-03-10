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
exports.userOAuthCallbackSignUP = exports.userSignIn = exports.userVerify = exports.userSignUp = void 0;
var sendEmail_1 = require("../../utils/sendEmail");
var ajv_1 = require("../../utils/ajv");
var errorResponse_1 = __importDefault(require("../../utils/errorResponse"));
var userModel_1 = __importDefault(require("./userModel"));
var emailMessage_1 = require("../../utils/emailMessage");
var userValidators_1 = require("./userValidators");
var customExpress_1 = require("../../utils/customExpress");
var SignUp = userValidators_1.UserValidator.SignUp, Verify = userValidators_1.UserValidator.Verify, SignIn = userValidators_1.UserValidator.SignIn;
// @route    POST api/v1/user/signUp
// @desc     Sign user up
// @access   Public
var userSignUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, sixDigits, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!SignUp.body(req.body)) return [3 /*break*/, 4];
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
                return [2 /*return*/, (0, customExpress_1.send)(res, 200, {
                        message: "Verification code has been send to ".concat(email),
                    })];
            case 4:
                next((0, ajv_1.avjErrorWrapper)(SignUp.body.errors));
                return [2 /*return*/];
        }
    });
}); };
exports.userSignUp = userSignUp;
// @route    POST api/v1/user/
// @desc
// @access   Public
var userVerify = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!Verify.body(req.body)) return [3 /*break*/, 3];
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
                next((0, ajv_1.avjErrorWrapper)(Verify.body.errors));
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
                if (!SignIn.body(req.body)) return [3 /*break*/, 5];
                _a = req.body, email = _a.email, login_name = _a.login_name, password = _a.password;
                return [4 /*yield*/, userModel_1.default.findOne({ login_name: login_name }).select('+password')];
            case 1:
                user = _b.sent();
                if (!!user) return [3 /*break*/, 3];
                return [4 /*yield*/, userModel_1.default.findOne({ email: email }).select('+password')];
            case 2:
                user = _b.sent();
                _b.label = 3;
            case 3:
                if (!user || !user.isActive) {
                    return [2 /*return*/, next(new errorResponse_1.default('User not found or maybe you have not been verified.', 404))];
                }
                return [4 /*yield*/, user.matchPassword(password)];
            case 4:
                isMatch = _b.sent();
                if (!isMatch) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid credentials.', 401))];
                }
                return [2 /*return*/, sendTokenResponse(user, 200, res)];
            case 5:
                next((0, ajv_1.avjErrorWrapper)(SignIn.body.errors));
                return [2 /*return*/];
        }
    });
}); };
exports.userSignIn = userSignIn;
// @route    Google OAuth callback
// @desc     Call back function for google OAuth
// @access   Public
var userOAuthCallbackSignUP = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (req.user) {
        }
        return [2 /*return*/];
    });
}); };
exports.userOAuthCallbackSignUP = userOAuthCallbackSignUP;
/*
// @route    POST api/v1/user/
// @desc
// @access   Public
export const userXXX: RequestHandler = async (req, res, next) => {
  if (XXX.body(req.body)) {
    // return send(res, {})
    // or
    // return XXX.sendData(res, {})
  }
  next(avjErrorWrapper(XXX.body.errors))
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
    var token = setToken(user, res);
    (0, customExpress_1.send)(res, statusCode);
    res.status(statusCode).json({ token: token });
};
