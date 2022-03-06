"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.getB2URL = exports.getItem = exports.addItem = exports.getItems = void 0;
var TwItem_1 = __importDefault(require("../../models/TwItem"));
var TwItemSetDetail_1 = __importDefault(require("../../models/TwItemSetDetail"));
var errorResponse_1 = __importDefault(require("../../utils/errorResponse"));
var b2_1 = require("../../utils/AWS/b2");
// Validator
var twItemValidate_1 = require("./twItemValidate");
// @route    GET api/v1/twItem/
// @desc     Get all items with specific user
// @access   Private
var getItems = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.status(200).json(res.advancedResults);
        return [2 /*return*/];
    });
}); };
exports.getItems = getItems;
// @route    POST api/v1/twItem/
// @desc     Add a item and ref to user
// @access   Private
var addItem = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, unit, custom_id, count_stock, item_type, element, item_for_user, item, set;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!((0, twItemValidate_1.addItemValidator)(req.body) && ((_b = req.userJWT) === null || _b === void 0 ? void 0 : _b.id))) return [3 /*break*/, 5];
                _a = req.body, name_1 = _a.name, unit = _a.unit, custom_id = _a.custom_id, count_stock = _a.count_stock, item_type = _a.item_type, element = _a.element;
                return [4 /*yield*/, TwItem_1.default.findOne({
                        user: req.userJWT.id,
                        name: name_1.trim(),
                    })];
            case 1:
                item_for_user = _c.sent();
                if (item_for_user) {
                    return [2 /*return*/, next(new errorResponse_1.default("You have a item with same name: '".concat(name_1, "' ")))];
                }
                console.log(element);
                item = new TwItem_1.default({
                    user: req.userJWT.id,
                    name: name_1,
                    unit: unit,
                    custom_id: custom_id,
                    count_stock: count_stock,
                    item_type: item_type,
                });
                return [4 /*yield*/, item.save()];
            case 2:
                _c.sent();
                if (!(item_type === 'set')) return [3 /*break*/, 4];
                set = new TwItemSetDetail_1.default({
                    user: req.userJWT.id,
                    parentItem: item._id,
                    element: element,
                });
                return [4 /*yield*/, set.save()];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                res.status(200).json(item);
                _c.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addItem = addItem;
// @route    GET api/v1/twItem/:id
// @desc     Get single item by item's id
// @access   Private
var getItem = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // itemOwnerMiddleware result will ensure res.item will not be null
        res.status(200).json(res.item);
        return [2 /*return*/];
    });
}); };
exports.getItem = getItem;
// @route    GET api/v1/twItem/uploadAvatar/:id
// @desc     Get B2 url for frontend to make a put request
// @access   Private
var getB2URL = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var itemId, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                itemId = req.params.id;
                return [4 /*yield*/, (0, b2_1.uploadImg)('TwItemImage', itemId)];
            case 1:
                result = _a.sent();
                if (!res.item) {
                    return [2 /*return*/, next(new errorResponse_1.default('B2 can not set image to item.', 500))];
                }
                res.item.image = result.Key;
                return [4 /*yield*/, res.item.save()];
            case 2:
                _a.sent();
                res.status(200).send(result);
                return [2 /*return*/];
        }
    });
}); };
exports.getB2URL = getB2URL;
// @route    PUT api/v1/twItem/:id
// @desc     Update item by item's id
// @access   Private
var updateItem = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_2, unit, custom_id, count_stock, item_type, item, item_for_user, err_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!((_b = req.userJWT) === null || _b === void 0 ? void 0 : _b.id)) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid credentials.', 401))];
                }
                if (!((0, twItemValidate_1.addItemValidator)(req.body) && res.item)) return [3 /*break*/, 6];
                _a = req.body, name_2 = _a.name, unit = _a.unit, custom_id = _a.custom_id, count_stock = _a.count_stock, item_type = _a.item_type;
                item = res.item;
                return [4 /*yield*/, TwItem_1.default.findOne({
                        user: req.userJWT.id,
                        name: name_2.trim(),
                    })
                    // Check if that item not equal with item(/:id)
                ];
            case 1:
                item_for_user = _c.sent();
                // Check if that item not equal with item(/:id)
                if ((item_for_user === null || item_for_user === void 0 ? void 0 : item_for_user.custom_id) &&
                    (item_for_user === null || item_for_user === void 0 ? void 0 : item_for_user.custom_id) !== item.custom_id) {
                    return [2 /*return*/, next(new errorResponse_1.default("You have a item with same name: '".concat(name_2, "' ")))];
                }
                item.name = name_2 ? name_2 : item.name;
                item.unit = unit ? unit : item.unit;
                item.custom_id = custom_id ? custom_id : item.custom_id;
                item.count_stock = count_stock ? count_stock : item.count_stock;
                item.item_type = item_type ? item_type : item.item_type;
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, item.save()];
            case 3:
                _c.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _c.sent();
                return [2 /*return*/, next(new errorResponse_1.default('Something wrong. Maybe there has duplicate field in your items', 401, err_1))];
            case 5:
                res.status(200).json(item);
                _c.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateItem = updateItem;
// @route    DELETE api/v1/twItem/:id
// @desc     Update item by item's id
// @access   Private
var deleteItem = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        (_a = res.item) === null || _a === void 0 ? void 0 : _a.delete();
        res.status(200).json('Item deleted.');
        return [2 /*return*/];
    });
}); };
exports.deleteItem = deleteItem;
