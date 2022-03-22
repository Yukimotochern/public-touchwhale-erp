"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemIO = void 0;
const mongodb_1 = require("../../utils/mongodb");
const apiIO_1 = require("../apiIO");
var ItemIO;
(function (ItemIO) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const plainItemSchema = {
        type: 'object',
        properties: {
            ...mongodb_1.MongooseStaticsJSONSchema,
            ...mongodb_1.MongooseStampsJSONSchema,
            name: { type: 'string' },
            unit: { type: 'string' },
            custom_id: { type: 'string' },
            count_stock: { type: 'boolean' },
            item_type: { type: 'string' },
            owner: { type: 'string' },
            image: { type: 'string' },
            element: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        qty: { type: 'number' },
                        id: { type: 'string' },
                    },
                    required: ['id', 'qty'],
                },
            },
        },
        required: [],
        additionalProperties: true,
    };
    // const addItemSehema: JSONSchemaType<ItemType.addItemBodyType> = {
    //   type: 'object',
    //   properties: {
    //   }
    // }
    const addItemBodySchema = {
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
                        qty: { type: 'number' },
                        id: { type: 'string' },
                    },
                    required: ['id', 'qty'],
                },
            },
        },
        required: ['name'],
        additionalProperties: false,
    };
    class AddItem extends (_b = apiIO_1.HandlerIO) {
    }
    _a = AddItem;
    AddItem.bodyValidator = Reflect.get(_b, "bodyValidatorCreator", _a).call(_a, addItemBodySchema);
    AddItem.sendData = Reflect.get(_b, "sendDataCreator", _a).call(_a, plainItemSchema);
    ItemIO.AddItem = AddItem;
    class UpdateItem extends (_d = apiIO_1.HandlerIO) {
    }
    _c = UpdateItem;
    UpdateItem.bodyValidator = Reflect.get(_d, "bodyValidatorCreator", _c).call(_c, addItemBodySchema);
    UpdateItem.sendData = Reflect.get(_d, "sendDataCreator", _c).call(_c, plainItemSchema);
    ItemIO.UpdateItem = UpdateItem;
    class GetItem extends (_f = apiIO_1.HandlerIO) {
    }
    _e = GetItem;
    GetItem.sendData = Reflect.get(_f, "sendDataCreator", _e).call(_e, plainItemSchema);
    ItemIO.GetItem = GetItem;
    class GetImageUploadUrl extends (_h = apiIO_1.HandlerIO) {
    }
    _g = GetImageUploadUrl;
    GetImageUploadUrl.sendData = Reflect.get(_h, "sendDataCreator", _g).call(_g, {
        type: 'object',
        properties: {
            image: { type: 'string' },
            uploadUrl: { type: 'string' },
        },
        required: ['image', 'uploadUrl'],
        additionalProperties: false,
    });
    ItemIO.GetImageUploadUrl = GetImageUploadUrl;
})(ItemIO = exports.ItemIO || (exports.ItemIO = {}));
