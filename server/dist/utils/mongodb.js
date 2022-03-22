"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseStampsJSONSchema = exports.MongooseStaticsJSONSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        let connect;
        if (process.env.NODE_ENV === 'test') {
            console.log('------Test Mode------'.bgYellow);
            connect = await mongoose_1.default.connect(process.env.MONGO_URI_TEST);
        }
        else {
            connect = await mongoose_1.default.connect(process.env.MONGO_URI);
        }
        console.log(`[server] MongoDB Connected: ${connect.connection.host}`.cyan.underline
            .bold);
    }
    catch (err) {
        if (typeof err.message === 'string') {
            console.error('Cannot Start MongoDB Connection With the Following Error: ', err.message);
        }
        else {
            console.error(`Unknown thing thrown: ${err}`);
        }
        // Exit process with failure
        process.exit(1);
    }
};
exports.MongooseStaticsJSONSchema = {
    _id: { type: 'string' },
    __v: { type: 'number' },
};
exports.MongooseStampsJSONSchema = {
    createdAt: {
        anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
    },
    updatedAt: {
        anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
    },
};
exports.default = connectDB;
