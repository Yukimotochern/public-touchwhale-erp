"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = require("../server");
const UserTest_1 = require("./tests/UserTest");
const WorkerTest_1 = require("./tests/WorkerTest");
beforeAll(async () => {
    // Connect to MongoDB
    // const url = `mongodb://127.0.0.1/test_db`
    // await mongoose.connect(url)
});
describe('Test all features', () => {
    (0, UserTest_1.User_Test)();
    (0, WorkerTest_1.Worker_Test)();
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
