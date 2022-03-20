"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var server_1 = __importStar(require("../server"));
var mongoose_1 = __importDefault(require("mongoose"));
var supertest_1 = __importDefault(require("supertest"));
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var form_data_1 = __importDefault(require("form-data"));
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); });
var verification_code;
var resetPassword_url;
var resetPassword_token;
var token;
var getUploadAvatar;
// example
describe('User SignUp -> Get User Test', function () {
    it('POST SignUp User', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                        .post('/api/v1/user/signUp')
                        .send({
                        email: 'testEmail@gmail.com',
                    })
                        .set('Accept', 'application/json')];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(typeof res.body.message).toBe('string');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Get verification code from mailtrap...', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, res_inbox, mail_id, res_mail, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        headers: { 'Api-Token': '8dc36cac15386caa83a61fdaeced2cb8' },
                    };
                    return [4 /*yield*/, axios_1.default.get('https://mailtrap.io/api/v1/inboxes/1616396/messages', options)];
                case 1:
                    res_inbox = _a.sent();
                    mail_id = res_inbox.data[0]['id'];
                    return [4 /*yield*/, axios_1.default.get("https://mailtrap.io/api/v1/inboxes/1616396/messages/".concat(mail_id, "/body.txt"), options)];
                case 2:
                    res_mail = _a.sent();
                    data = res_mail.data.split(' ');
                    verification_code = data[data.length - 1].split('\n')[0];
                    console.log('****'.bgBlue, 'Verification code:', verification_code, '****'.bgBlue);
                    return [2 /*return*/];
            }
        });
    }); });
    it('POST Verify User', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                        .post('/api/v1/user/signUp/verify')
                        .send({
                        email: 'testEmail@gmail.com',
                        password: verification_code,
                    })
                        .set('Accept', 'application/json')];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(typeof res.body.data).toBe('string');
                    token = res.body.data;
                    return [2 /*return*/];
            }
        });
    }); });
    it('PUT Set Password', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                        .put('/api/v1/user/changePassword')
                        .set('Cookie', ["token=".concat(token)])
                        .send({
                        newPassword: 'test1234',
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('POST User SignIn', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                        .post('/api/v1/user/signIn')
                        .send({
                        email: 'testEmail@gmail.com',
                        password: 'test1234',
                    })
                        .set('Accept', 'application/json')];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('GET Get User infomation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                        .get('/api/v1/user')
                        .set('Cookie', ["token=".concat(token)])];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(typeof res.body).toBe('object');
                    return [2 /*return*/];
            }
        });
    }); });
    it('PUT Update User', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                        .put('/api/v1/user')
                        .send({
                        username: 'testAccount',
                        company: 'FacGooAmazFilx',
                    })
                        .set('Accept', 'application/json')
                        .set('Cookie', ["token=".concat(token)])];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(typeof res.body).toBe('object');
                    return [2 /*return*/];
            }
        });
    }); });
    it('GET Upload Avatar URL', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                        .get('/api/v1/user/avatar')
                        .set('Cookie', ["token=".concat(token)])];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(typeof res.body).toBe('object');
                    getUploadAvatar = res.body.data;
                    console.log(getUploadAvatar);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Upload Avatar to B2 ...', function () { return __awaiter(void 0, void 0, void 0, function () {
        var uploadUrl, avatar, image, data, formData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uploadUrl = getUploadAvatar.uploadUrl, avatar = getUploadAvatar.avatar;
                    image = fs_1.default.createReadStream('./src/__tests__/public/testAvatar.png');
                    data = image.toString();
                    formData = new form_data_1.default();
                    formData.append('image', image);
                    return [4 /*yield*/, axios_1.default.put(uploadUrl, { data: Buffer.from(data, 'binary') }, {
                            withCredentials: true,
                            headers: { 'Content-Type': 'image/jpeg' },
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Delete Avatar', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                        .delete('/api/v1/user/avatar')
                        .set('Cookie', ["token=".concat(token)])];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body.message).toBe('Avatar deleted.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Change Password', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                        .put('/api/v1/user/changePassword')
                        .send({
                        currentPassword: 'test1234',
                        newPassword: 'Test2345',
                    })
                        .set('Cookie', ["token=".concat(token)])];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Forget Passwrod', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default).post('/api/v1/user/forgetPassword').send({
                        email: 'testEmail@gmail.com',
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Get resetPassword url from mailtrap...', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, res_inbox, mail_id, res_mail, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        headers: { 'Api-Token': '8dc36cac15386caa83a61fdaeced2cb8' },
                    };
                    return [4 /*yield*/, axios_1.default.get('https://mailtrap.io/api/v1/inboxes/1616396/messages', options)];
                case 1:
                    res_inbox = _a.sent();
                    mail_id = res_inbox.data[0]['id'];
                    return [4 /*yield*/, axios_1.default.get("https://mailtrap.io/api/v1/inboxes/1616396/messages/".concat(mail_id, "/body.txt"), options)];
                case 2:
                    res_mail = _a.sent();
                    data = res_mail.data.split(' ');
                    resetPassword_url = data[data.length - 1].split('\n')[0];
                    resetPassword_token =
                        resetPassword_url.split('/')[resetPassword_url.split('/').length - 1];
                    console.log('****'.bgBlue, 'Reset Password URL:', resetPassword_url, 'Reset Password Token:', resetPassword_token, '****'.bgBlue);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Reset Password', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default).put('/api/v1/user/forgerPassword').send({
                        token: resetPassword_token,
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(typeof res.body.data.token).toBe('string');
                    resetPassword_token = res.body.data.token;
                    console.log('****'.bgBlue, 'New Reset Password Token:', resetPassword_token, '****'.bgBlue);
                    return [2 /*return*/];
            }
        });
    }); });
});
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var collections, _i, collections_1, collection;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mongoose_1.default.connection.db.collections()];
            case 1:
                collections = _a.sent();
                _i = 0, collections_1 = collections;
                _a.label = 2;
            case 2:
                if (!(_i < collections_1.length)) return [3 /*break*/, 5];
                collection = collections_1[_i];
                return [4 /*yield*/, collection.drop()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                mongoose_1.default.disconnect();
                server_1.server.close();
                return [2 /*return*/];
        }
    });
}); });
