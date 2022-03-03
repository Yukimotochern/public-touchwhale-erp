"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addItemValidator = void 0;
var ajv_1 = __importDefault(require("../../utils/ajv"));
var addItemBodySchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        unit: { type: 'string' },
        custom_id: { type: 'string' },
        count_stock: { type: 'boolean' },
        item_type: { type: 'string' },
        // element will store in TwItemSetDetail model
        element: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    quantity: { type: 'number' },
                    objectId: { type: 'string' },
                },
            },
        },
    },
    required: [],
    additionalProperties: false,
};
var addItemValidator = ajv_1.default.compile(addItemBodySchema);
exports.addItemValidator = addItemValidator;
