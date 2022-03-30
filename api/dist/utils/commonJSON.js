"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonSchema = exports.owner = void 0;
const mongoTypes_1 = require("./mongoTypes");
exports.owner = {
    owner: { type: 'string' },
};
exports.commonSchema = {
    ...mongoTypes_1.MongooseStampsJSONSchema,
    ...mongoTypes_1.MongooseStaticsJSONSchema,
    ...exports.owner,
};
