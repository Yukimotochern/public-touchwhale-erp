"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemSetValidator = void 0;
var ajv_1 = __importDefault(require("../../utils/ajv"));
// interface elementInnerType {
// 	items: string
// }
// const elementInnerSchema: JSONSchemaType<elementInnerType = {
// 	type: 'array',
// 	properties: {
// 		items: { type: 'string' },
// 	},
// 	required: [],
// 	additionalProperties: false,
// }
var itemSetBodySchema = {
    type: 'object',
    properties: {
        element: {
            type: 'array',
            items: {
                type: 'object',
                properties: { quantity: 'number', objectId: 'string' },
            },
        },
    },
    required: [],
    additionalProperties: false,
};
var itemSetValidator = ajv_1.default.compile(itemSetBodySchema);
exports.itemSetValidator = itemSetValidator;
