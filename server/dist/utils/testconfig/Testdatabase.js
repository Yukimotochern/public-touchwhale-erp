"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongodb_1 = require("mongodb");
let connection;
let mongoServer;
const connect = async () => {
    try {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = await mongoServer.getUri();
        connection = await mongodb_1.MongoClient.connect(uri, {}, (err) => {
            if (err) {
                console.log(err);
            }
        });
        console.log(connection);
    }
    catch (err) {
        console.log('Mongodb memory server Error', err);
    }
};
const close = async () => {
    try {
        await mongoose_1.default.connection.dropDatabase();
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    }
    catch (err) { }
};
const clear = async () => {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
};
exports.default = { connect, close, clear };
