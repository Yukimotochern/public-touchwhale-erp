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
exports.forgetpassword = exports.resetpassword = exports.updateUser = exports.getUser = exports.userSignout = exports.userSignin = exports.usersignup = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var User_1 = __importDefault(require("../../model/User"));
// @route    POST api/user/signup
// @desc     Signup user
// @access   Public
var usersignup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, company_name, password, user, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, company_name = _a.company_name, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 2:
                user = _b.sent();
                if (user) {
                    return [2 /*return*/, res.status(200).json({ error: 'User already exists.' })];
                }
                // @TODO: avatar load
                user = new User_1.default({
                    company_name: company_name,
                    email: email,
                    password: password,
                });
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                sendTokenResponse(user, 200, res);
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                console.log(err_1);
                res.status(500).send('Server error.');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.usersignup = usersignup;
// @route    POST api/user/signin
// @desc     Signin user
// @access   Public
var userSignin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: 'Please provide an email and password. ' })];
                }
                return [4 /*yield*/, User_1.default.findOne({ email: email }).select('+password')];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid credentials.' })];
                }
                return [4 /*yield*/, user.matchPassword(password)];
            case 2:
                isMatch = _b.sent();
                if (!isMatch) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid credentials.' })];
                }
                sendTokenResponse(user, 200, res);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                console.log(err_2);
                res.status(500).send('Server error.');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.userSignin = userSignin;
// @route    GET api/user/logout
// @desc     Signout user
// @access   Private
var userSignout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.cookie('token', 'none', {
                expires: new Date(Date.now() + 10 * 1000),
                httpOnly: true,
            });
            res.status(200).json({
                data: {},
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).send('Server error.');
        }
        return [2 /*return*/];
    });
}); };
exports.userSignout = userSignout;
// @route    GET api/user/
// @desc     Get user infomation
// @access   Private
var getUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cookie, id, user, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                cookie = req.cookies.token;
                if (!cookie) {
                    return [2 /*return*/, res.status(401).send('Something wrong.')];
                }
                id = jsonwebtoken_1.default.decode(cookie).id;
                return [4 /*yield*/, User_1.default.findById(id)];
            case 1:
                user = _a.sent();
                res.status(200).json({
                    data: user,
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.log(err_3);
                res.status(500).send('Server error.');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
// @route    PUT api/user/
// @desc     Update user infomation
// @access   Private
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, company_name, email, password, fieldsToUpdate, cookie, id, user, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, company_name = _a.company_name, email = _a.email, password = _a.password;
                fieldsToUpdate = {
                    company_name: company_name,
                    email: email,
                };
                cookie = req.cookies.token;
                if (!cookie) {
                    return [2 /*return*/, res.status(401).send('Something wrong.')];
                }
                id = jsonwebtoken_1.default.decode(cookie).id;
                return [4 /*yield*/, User_1.default.findByIdAndUpdate(id, fieldsToUpdate, {
                        new: true,
                        runValidators: true,
                    })];
            case 1:
                user = _b.sent();
                res.status(200).json({
                    data: user,
                });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _b.sent();
                console.log(err_4);
                res.status(500).send('Server error.');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
// @route    PUT api/user/resetpassword
// @desc     Update password
// @access   Private
var resetpassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cookie, id, user, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                cookie = req.cookies.token;
                if (!cookie) {
                    return [2 /*return*/, res.status(401).send('Something wrong.')];
                }
                id = jsonwebtoken_1.default.decode(cookie).id;
                return [4 /*yield*/, User_1.default.findById(id).select('+password')];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(500).send('Server error.')];
                }
                return [4 /*yield*/, (user === null || user === void 0 ? void 0 : user.matchPassword(req.body.currentPassword))];
            case 2:
                if (!(_a.sent())) {
                    return [2 /*return*/, res.status(400).json({ error: 'Password is incorrect.' })];
                }
                user.password = req.body.newPassword;
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                sendTokenResponse(user, 200, res);
                return [3 /*break*/, 5];
            case 4:
                err_5 = _a.sent();
                console.log(err_5);
                res.status(500).send('Server error.');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.resetpassword = resetpassword;
// @route    PUT api/user/forgetpassword
// @desc     Forget password
// @access   Public
var forgetpassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, resetUrl, message, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User_1.default.findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ error: 'There is no user with that email.' })];
                }
                token = user.getForgetPasswordToken();
                console.log(token);
                return [4 /*yield*/, user.save({ validateBeforeSave: false })
                    // Create url
                ];
            case 2:
                _a.sent();
                resetUrl = "".concat(req.protocol, "://").concat(req.get('host'), "/api/v1/user/forgetpassword/").concat(token);
                message = "Make a PUT request to: \n ".concat(resetUrl);
                _a.label = 3;
            case 3:
                _a.trys.push([3, 4, , 6]);
                return [3 /*break*/, 6];
            case 4:
                err_6 = _a.sent();
                console.log(err_6);
                user.forgetPasswordToken = undefined;
                user.forgetPasswordExpire = undefined;
                return [4 /*yield*/, user.save({ validateBeforeSave: false })];
            case 5:
                _a.sent();
                res.status(500).send('Email could not be sent.');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.forgetpassword = forgetpassword;
// Helper function
var sendTokenResponse = function (user, statusCode, res) {
    var token = user.getSignedJwtToken();
    var options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000),
        httpOnly: true,
    };
    res.status(statusCode).cookie('token', token, options).json({ token: token });
};
