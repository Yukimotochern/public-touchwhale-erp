"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importStar(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const form_data_1 = __importDefault(require("form-data"));
beforeAll(async () => {
    // Connect to MongoDB
    // const url = `mongodb://127.0.0.1/test_db`
    // await mongoose.connect(url)
});
let verification_code;
let resetPassword_url;
let resetPassword_token;
let token;
let getUploadAvatar;
// example
describe('User SignUp -> Get User Test', () => {
    it('POST SignUp User', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/v1/user/signUp')
            .send({
            email: 'testEmail@gmail.com',
        })
            .set('Accept', 'application/json');
        expect(res.status).toBe(200);
        expect(typeof res.body.message).toBe('string');
    });
    it('Get verification code from mailtrap...', async () => {
        const options = {
            headers: { 'Api-Token': '8dc36cac15386caa83a61fdaeced2cb8' },
        };
        // await fetch('https://mailtrap.io/api/v1/user', options)
        const res_inbox = await axios_1.default.get('https://mailtrap.io/api/v1/inboxes/1616396/messages', options);
        const mail_id = res_inbox.data[0]['id'];
        const res_mail = await axios_1.default.get(`https://mailtrap.io/api/v1/inboxes/1616396/messages/${mail_id}/body.txt`, options);
        const data = res_mail.data.split(' ');
        verification_code = data[data.length - 1].split('\n')[0];
        console.log('****'.bgBlue, 'Verification code:', verification_code, '****'.bgBlue);
    });
    it('POST Verify User', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/v1/user/signUp/verify')
            .send({
            email: 'testEmail@gmail.com',
            password: verification_code,
        })
            .set('Accept', 'application/json');
        expect(res.status).toBe(200);
        expect(typeof res.body.data).toBe('string');
        token = res.body.data;
    });
    it('PUT Set Password', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .put('/api/v1/user/changePassword')
            .set('Cookie', [`token=${token}`])
            .send({
            newPassword: 'test1234',
        });
        expect(res.status).toBe(200);
    });
    it('POST User SignIn', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/v1/user/signIn')
            .send({
            email: 'testEmail@gmail.com',
            password: 'test1234',
        })
            .set('Accept', 'application/json');
        expect(res.status).toBe(200);
    });
    it('GET Get User infomation', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .get('/api/v1/user')
            .set('Cookie', [`token=${token}`]);
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
    });
    it('PUT Update User', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .put('/api/v1/user')
            .send({
            username: 'testAccount',
            company: 'FacGooAmazFilx',
        })
            .set('Accept', 'application/json')
            .set('Cookie', [`token=${token}`]);
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
        // expect(console.log(res))
    });
    it('GET Upload Avatar URL', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .get('/api/v1/user/avatar')
            .set('Cookie', [`token=${token}`]);
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
        getUploadAvatar = res.body.data;
        console.log(getUploadAvatar);
    });
    it('Upload Avatar to B2 ...', async () => {
        const { uploadUrl, avatar } = getUploadAvatar;
        let image = fs_1.default.createReadStream('./src/__tests__/public/testAvatar.png');
        let data = image.toString();
        const formData = new form_data_1.default();
        formData.append('image', image);
        await axios_1.default.put(uploadUrl, { data: Buffer.from(data, 'binary') }, {
            withCredentials: true,
            headers: { 'Content-Type': 'image/jpeg' },
        });
    });
    it('Delete Avatar', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .delete('/api/v1/user/avatar')
            .set('Cookie', [`token=${token}`]);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Avatar deleted.');
    });
    it('Change Password', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .put('/api/v1/user/changePassword')
            .send({
            currentPassword: 'test1234',
            newPassword: 'Test2345',
        })
            .set('Cookie', [`token=${token}`]);
        expect(res.status).toBe(200);
    });
    it('Forget Passwrod', async () => {
        const res = await (0, supertest_1.default)(server_1.default).post('/api/v1/user/forgetPassword').send({
            email: 'testEmail@gmail.com',
        });
        expect(res.status).toBe(200);
    });
    it('Get resetPassword url from mailtrap...', async () => {
        const options = {
            headers: { 'Api-Token': '8dc36cac15386caa83a61fdaeced2cb8' },
        };
        // await fetch('https://mailtrap.io/api/v1/user', options)
        const res_inbox = await axios_1.default.get('https://mailtrap.io/api/v1/inboxes/1616396/messages', options);
        const mail_id = res_inbox.data[0]['id'];
        const res_mail = await axios_1.default.get(`https://mailtrap.io/api/v1/inboxes/1616396/messages/${mail_id}/body.txt`, options);
        const data = res_mail.data.split(' ');
        resetPassword_url = data[data.length - 1].split('\n')[0];
        resetPassword_token =
            resetPassword_url.split('/')[resetPassword_url.split('/').length - 1];
        console.log('****'.bgBlue, 'Reset Password URL:', resetPassword_url, 'Reset Password Token:', resetPassword_token, '****'.bgBlue);
    });
    it('Reset Password First Call', async () => {
        const res = await (0, supertest_1.default)(server_1.default).put('/api/v1/user/forgetPassword').send({
            token: resetPassword_token,
        });
        expect(res.status).toBe(200);
        expect(typeof res.body.data.token).toBe('string');
        resetPassword_token = res.body.data.token;
        console.log('****'.bgBlue, 'New Reset Password Token:', resetPassword_token, '****'.bgBlue);
    });
    it('Resrt Password Second Call', async () => {
        const res = await (0, supertest_1.default)(server_1.default).put('/api/v1/user/forgetPassword').send({
            token: resetPassword_token,
            password: 'test3456',
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Your password has been set.');
    });
    it('POST User SignIn After Resetpassword', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/v1/user/signIn')
            .send({
            email: 'testEmail@gmail.com',
            password: 'test3456',
        })
            .set('Accept', 'application/json');
        expect(res.status).toBe(200);
        token = res.body;
    });
    // it('POST Create Worker', async () => {
    // 	const res = await request(app)
    // 		.post('/api/v1/user/workers')
    // 		.send({
    // 			login_name: 'TestWorker',
    // 			password: 'test1234',
    // 			role_type: 'default',
    // 			permission_groups: ['human resource'],
    // 			provider: 'TouchWhale',
    // 			isActice: true,
    // 			isOwner: false,
    // 		})
    // 		.set('Accept', 'application/json')
    // 		.set('Cookie', [`token=${token}`])
    // 	console.log(res)
    // 	expect(res.status).toBe(200)
    // })
});
afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    const collections = await mongoose_1.default.connection.db.collections();
    for (let collection of collections) {
        await collection.drop();
    }
    mongoose_1.default.disconnect();
    server_1.server.close();
    // done()
});
