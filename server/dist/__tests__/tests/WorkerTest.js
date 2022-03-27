"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker_Test = void 0;
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
let token;
const RequestServer = (0, supertest_1.default)(server_1.default);
const Worker_Test = () => {
    it('SignIn a admin user', async () => {
        const res = await RequestServer.post('/api/v1/user/signIn')
            .send({
            email: 'testEmail@gmail.com',
            password: 'test3456',
        })
            .set('Accept', 'application/json');
        expect(res.status).toBe(200);
        token = res.body;
    });
    describe('Worker function', () => {
        it('POST Create a worker', async () => {
            const res = await RequestServer.post('/api/v1/user/workers')
                .set('Cookie', [`token=${token}`])
                .send({
                login_name: 'testworker1234',
                password: 'test1234',
                permission_groups: ['admin'],
                role_type: 'default',
            });
            expect(res.status).toBe(200);
        });
        it('GET User signout', async () => {
            const res = await RequestServer.get('/api/v1/user/signOut');
            expect(res.status).toBe(200);
        });
        it('POST Worker signin', async () => {
            const res = await RequestServer.post('/api/v1/user/signIn')
                .send({
                login_name: 'testworker1234',
                password: 'test1234',
            })
                .set('Accept', 'application/json');
            console.log(res);
            expect(res.status).toBe(200);
        });
    });
};
exports.Worker_Test = Worker_Test;
