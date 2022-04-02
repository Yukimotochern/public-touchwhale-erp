"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetImageUploadUrl = exports.GetItems = exports.GetItemsWithDetail = exports.GetItem = exports.UpdateItem = exports.CreateItem = exports.twItemWithSetDetailPopulatedSchema = exports.twItemSetDetailPopulatedConstSchema = exports.populated_members = exports.twItemWithSetDetailSchema = exports.twItemDefiniteProperties = exports.editableProperties = exports.twItemSetDetailSchema = exports.twItemSetDetailConstSchema = exports.members = void 0;
const api_1 = require("../api");
const commonJSON_1 = require("../utils/commonJSON");
const advancedResultTypes_1 = require("../advancedResult/advancedResultTypes");
// Set detail
exports.members = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            qty: { type: 'integer' },
            member: { type: 'string' },
        },
        required: ['member', 'qty'],
        additionalProperties: false,
    },
};
exports.twItemSetDetailConstSchema = {
    type: 'object',
    properties: {
        ...commonJSON_1.commonSchema,
        parentItem: { type: 'string' },
        members: exports.members,
    },
    required: ['owner', 'parentItem'],
    additionalProperties: false,
};
exports.twItemSetDetailSchema = exports.twItemSetDetailConstSchema;
// definite properties for twItem
exports.editableProperties = {
    name: { type: 'string', nullable: true },
    unit: { type: 'string', nullable: true },
    custom_id: { type: 'string', nullable: true },
    count_stock: { type: 'boolean' },
    item_type: { type: 'string', enum: ['element', 'set'] },
    image: { type: 'array', items: { type: 'string' }, nullable: true },
};
exports.twItemDefiniteProperties = {
    ...commonJSON_1.commonSchema,
    ...exports.editableProperties,
};
// Without detail
const twItemConstSchema = {
    type: 'object',
    properties: {
        ...exports.twItemDefiniteProperties,
    },
    required: ['owner', 'count_stock', 'item_type', 'image'],
    additionalProperties: false,
};
const twItemSchema = twItemConstSchema;
// With detail
exports.twItemWithSetDetailSchema = {
    type: 'object',
    properties: {
        ...exports.twItemDefiniteProperties,
        set_detail: { ...exports.twItemSetDetailConstSchema, nullable: true },
    },
    required: ['owner', 'count_stock', 'item_type', 'image', 'set_detail'],
    additionalProperties: false,
};
// With detail populated
exports.populated_members = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            qty: { type: 'integer' },
            member: twItemConstSchema,
        },
        required: ['member', 'qty'],
        additionalProperties: false,
    },
};
exports.twItemSetDetailPopulatedConstSchema = {
    type: 'object',
    properties: {
        ...commonJSON_1.commonSchema,
        parentItem: { type: 'string' },
        members: exports.populated_members,
    },
    required: ['owner', 'parentItem'],
    additionalProperties: false,
};
exports.twItemWithSetDetailPopulatedSchema = {
    type: 'object',
    properties: {
        ...exports.twItemDefiniteProperties,
        set_detail: { ...exports.twItemSetDetailPopulatedConstSchema, nullable: true },
    },
    required: ['owner', 'count_stock', 'item_type', 'image', 'set_detail'],
    additionalProperties: false,
};
var CreateItem;
(function (CreateItem) {
    CreateItem.API = new api_1.api({
        bodySchema: {
            type: 'object',
            properties: {
                twItem: {
                    type: 'object',
                    properties: exports.editableProperties,
                    required: ['count_stock', 'item_type'],
                    additionalProperties: false,
                },
                members: { ...exports.members, nullable: true },
            },
            required: ['twItem'],
        },
        dataSchema: exports.twItemWithSetDetailPopulatedSchema,
    });
})(CreateItem = exports.CreateItem || (exports.CreateItem = {}));
var UpdateItem;
(function (UpdateItem) {
    UpdateItem.API = new api_1.api({
        bodySchema: {
            type: 'object',
            properties: {
                twItem: {
                    type: 'object',
                    properties: {
                        ...exports.editableProperties,
                        count_stock: { type: 'boolean', nullable: true },
                        item_type: {
                            type: 'string',
                            enum: ['element', 'set'],
                            nullable: true,
                        },
                        image: { type: 'array', items: { type: 'string' }, nullable: true },
                    },
                    additionalProperties: false,
                    nullable: true,
                },
                members: { ...exports.members, nullable: true },
            },
        },
        dataSchema: exports.twItemWithSetDetailPopulatedSchema,
    });
})(UpdateItem = exports.UpdateItem || (exports.UpdateItem = {}));
var GetItem;
(function (GetItem) {
    GetItem.API = new api_1.api({
        dataSchema: exports.twItemWithSetDetailPopulatedSchema,
    });
})(GetItem = exports.GetItem || (exports.GetItem = {}));
var GetItemsWithDetail;
(function (GetItemsWithDetail) {
    GetItemsWithDetail.API = new api_1.api().setDataValidator((0, advancedResultTypes_1.getAdvancedResultSchema)({
        type: 'array',
        items: exports.twItemWithSetDetailPopulatedSchema,
    }));
})(GetItemsWithDetail = exports.GetItemsWithDetail || (exports.GetItemsWithDetail = {}));
var GetItems;
(function (GetItems) {
    GetItems.API = new api_1.api().setDataValidator((0, advancedResultTypes_1.getAdvancedResultSchema)({
        type: 'array',
        items: twItemSchema,
    }));
})(GetItems = exports.GetItems || (exports.GetItems = {}));
var GetImageUploadUrl;
(function (GetImageUploadUrl) {
    GetImageUploadUrl.API = new api_1.api({
        dataSchema: {
            type: 'object',
            properties: {
                image: { type: 'string' },
                uploadUrl: { type: 'string' },
            },
            required: ['image', 'uploadUrl'],
            additionalProperties: false,
        },
    });
})(GetImageUploadUrl = exports.GetImageUploadUrl || (exports.GetImageUploadUrl = {}));
