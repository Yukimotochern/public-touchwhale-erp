"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemIO = void 0;
var mongodb_1 = require("../../utils/mongodb");
var apiIO_1 = require("../apiIO");
var ItemIO;
(function (ItemIO) {
    var plainItemSchema = {
        type: 'object',
        properties: __assign(__assign(__assign({}, mongodb_1.MongooseStaticsJSONSchema), mongodb_1.MongooseStampsJSONSchema), { name: { type: 'string' }, unit: { type: 'string' }, custom_id: { type: 'string' }, count_stock: { type: 'boolean' }, item_type: { type: 'string' }, owner: { type: 'string' }, image: { type: 'string' }, element: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        qty: { type: 'number' },
                        id: { type: 'string' },
                    },
                    required: ['id', 'qty'],
                },
            } }),
        required: [],
        additionalProperties: true,
    };
    // const addItemSehema: JSONSchemaType<ItemType.addItemBodyType> = {
    //   type: 'object',
    //   properties: {
    //   }
    // }
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
    var AddItem = /** @class */ (function (_super) {
        __extends(AddItem, _super);
        function AddItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _a;
        _a = AddItem;
        AddItem.bodyValidator = _super.bodyValidatorCreator.call(_a, addItemBodySchema);
        AddItem.sendData = _super.sendDataCreator.call(_a, plainItemSchema);
        return AddItem;
    }(apiIO_1.HandlerIO));
    ItemIO.AddItem = AddItem;
    var UpdateItem = /** @class */ (function (_super) {
        __extends(UpdateItem, _super);
        function UpdateItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _b;
        _b = UpdateItem;
        UpdateItem.bodyValidator = _super.bodyValidatorCreator.call(_b, addItemBodySchema);
        UpdateItem.sendData = _super.sendDataCreator.call(_b, plainItemSchema);
        return UpdateItem;
    }(apiIO_1.HandlerIO));
    ItemIO.UpdateItem = UpdateItem;
    var GetItem = /** @class */ (function (_super) {
        __extends(GetItem, _super);
        function GetItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _c;
        _c = GetItem;
        GetItem.sendData = _super.sendDataCreator.call(_c, plainItemSchema);
        return GetItem;
    }(apiIO_1.HandlerIO));
    ItemIO.GetItem = GetItem;
    var GetImageUploadUrl = /** @class */ (function (_super) {
        __extends(GetImageUploadUrl, _super);
        function GetImageUploadUrl() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        var _d;
        _d = GetImageUploadUrl;
        GetImageUploadUrl.sendData = _super.sendDataCreator.call(_d, {
            type: 'object',
            properties: {
                image: { type: 'string' },
                uploadUrl: { type: 'string' },
            },
            required: ['image', 'uploadUrl'],
            additionalProperties: false,
        });
        return GetImageUploadUrl;
    }(apiIO_1.HandlerIO));
    ItemIO.GetImageUploadUrl = GetImageUploadUrl;
})(ItemIO = exports.ItemIO || (exports.ItemIO = {}));
