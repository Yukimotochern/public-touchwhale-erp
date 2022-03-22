"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseStaticsJSONSchema = exports.MongooseStampsJSONSchema = void 0;
// Schema
exports.MongooseStampsJSONSchema = {
    createdAt: {
        anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
    },
    updatedAt: {
        anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
    },
};
exports.MongooseStaticsJSONSchema = {
    _id: { type: 'string' },
    __v: { type: 'number' },
};
