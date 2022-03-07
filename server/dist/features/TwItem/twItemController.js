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
// Models
var twItemModel_1 = require("./twItemModel");
var twItemModel_2 = require("./twItemModel");
// Utils modules
var b2_1 = require("../../utils/AWS/b2");
var errorResponse_1 = __importDefault(require("../../utils/errorResponse"));
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
                if (!((0, twItemValidate_1.addItemValidator)(req.body) && ((_b = req.userJWT) === null || _b === void 0 ? void 0 : _b.id))) return [3 /*break*/, 6];
                _a = req.body, name_1 = _a.name, unit = _a.unit, custom_id = _a.custom_id, count_stock = _a.count_stock, item_type = _a.item_type, element = _a.element;
                return [4 /*yield*/, twItemModel_1.TwItem.findOne({
                        user: req.userJWT.id,
                        name: name_1.trim(),
                    })];
            case 1:
                item_for_user = _c.sent();
                if (item_for_user) {
                    return [2 /*return*/, next(new errorResponse_1.default("You have a item with same name: '".concat(name_1, "' ")))];
                }
                if (item_type === 'element' && element) {
                    return [2 /*return*/, next(new errorResponse_1.default('You can not set element into single item.'))];
                }
                item = new twItemModel_1.TwItem({
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
                if (!(item_type === 'set')) return [3 /*break*/, 5];
                return [4 /*yield*/, item.save()];
            case 3:
                _c.sent();
                set = new twItemModel_2.TwItemSetDetail({
                    user: req.userJWT.id,
                    parentItem: item._id,
                    element: element,
                });
                return [4 /*yield*/, set.save()];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                res.status(200).json({ data: item });
                _c.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.addItem = addItem;
// "element": [{"qty": 2, "id": "62241c8f7096ddea6783e41a"}, {"qty": 3, "id": "622392fbafbb949826bd2a07"}]
// @route    GET api/v1/twItem/:id
// @desc     Get single item by item's id
// @access   Private
var getItem = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // itemOwnerMiddleware result will ensure res.item will not be null
        res.status(200).json({ data: res.item });
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
                return [4 /*yield*/, (0, b2_1.uploadImage)('TwItemImage', itemId)];
            case 1:
                result = _a.sent();
                if (!res.item) {
                    return [2 /*return*/, next(new errorResponse_1.default('B2 can not set image to item.', 500))];
                }
                res.item.image = result.Key;
                return [4 /*yield*/, res.item.save()];
            case 2:
                _a.sent();
                res.status(200).send({ msg: result });
                return [2 /*return*/];
        }
    });
}); };
exports.getB2URL = getB2URL;
// @route    PUT api/v1/twItem/:id
// @desc     Update item by item's id
// @access   Private
var updateItem = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_2, unit, custom_id, count_stock, item_type, element, item, item_for_user, _b, itemSetElement, set, err_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!((_c = req.userJWT) === null || _c === void 0 ? void 0 : _c.id)) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid credentials.', 401))];
                }
                if (!((0, twItemValidate_1.addItemValidator)(req.body) && res.item)) return [3 /*break*/, 13];
                _a = req.body, name_2 = _a.name, unit = _a.unit, custom_id = _a.custom_id, count_stock = _a.count_stock, item_type = _a.item_type, element = _a.element;
                item = res.item;
                return [4 /*yield*/, twItemModel_1.TwItem.findOne({
                        user: req.userJWT.id,
                        name: name_2.trim(),
                    })
                    // Check if that item not equal with item(/:id)
                ];
            case 1:
                item_for_user = _d.sent();
                // Check if that item not equal with item(/:id)
                if ((item_for_user === null || item_for_user === void 0 ? void 0 : item_for_user.custom_id) &&
                    (item_for_user === null || item_for_user === void 0 ? void 0 : item_for_user.custom_id) !== item.custom_id) {
                    return [2 /*return*/, next(new errorResponse_1.default("You have a item with same name: '".concat(name_2, "' ")))];
                }
                if (item_type === 'element' && element) {
                    return [2 /*return*/, next(new errorResponse_1.default('You can not set element into single intem.'))];
                }
                item.name = name_2 ? name_2 : item.name;
                item.unit = unit ? unit : item.unit;
                item.custom_id = custom_id ? custom_id : item.custom_id;
                item.count_stock = count_stock ? count_stock : item.count_stock;
                item.item_type = item_type ? item_type : item.item_type;
                _d.label = 2;
            case 2:
                _d.trys.push([2, 12, , 13]);
                _b = element;
                if (!_b) return [3 /*break*/, 4];
                return [4 /*yield*/, check_no_loop_Breadth_First_search(element, item.id)];
            case 3:
                _b = (_d.sent());
                _d.label = 4;
            case 4:
                if (!_b) return [3 /*break*/, 9];
                if (!res.itemSetElement) return [3 /*break*/, 6];
                itemSetElement = res.itemSetElement;
                itemSetElement.element = element;
                return [4 /*yield*/, itemSetElement.save()];
            case 5:
                _d.sent();
                return [3 /*break*/, 8];
            case 6:
                set = new twItemModel_2.TwItemSetDetail({
                    user: req.userJWT.id,
                    parentItem: item._id,
                    element: element,
                });
                return [4 /*yield*/, set.save()];
            case 7:
                _d.sent();
                _d.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9: return [2 /*return*/, next(new errorResponse_1.default('Items element has a loop. '))];
            case 10: return [4 /*yield*/, item.save()];
            case 11:
                _d.sent();
                res.status(200).json({ data: item });
                return [3 /*break*/, 13];
            case 12:
                err_1 = _d.sent();
                return [2 /*return*/, next(new errorResponse_1.default('Something wrong. Maybe there has duplicate field in your items', 401, err_1))];
            case 13: return [2 /*return*/];
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
        res.status(200).json({ msg: 'Item deleted.' });
        return [2 /*return*/];
    });
}); };
exports.deleteItem = deleteItem;
// Helper function
// find max level element and return max level
// const max_level = async (element: ElementObjectType[]) => {
//   // push all element's id in array
//   const elementId_array = new Array()
//   element.map((ele) => {
//     elementId_array.push(ele.id)
//   })
//   // find all document in element array
//   const all_element = await TwItem.find().where('_id').in(elementId_array)
//   // find max level document
//   let max_level_element = all_element.reduce(function (pre, cur) {
//     return pre.level > cur.level ? pre : cur
//   })
//   return max_level_element.level + 1
// }
var check_no_loop_Breadth_First_search = function (element, item_id) { return __awaiter(void 0, void 0, void 0, function () {
    var elementId_array, searched, _loop_1, state_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                elementId_array = new Array();
                element.map(function (ele) {
                    elementId_array.push(ele.id);
                });
                searched = new Array();
                _loop_1 = function () {
                    var new_element, new_child, new_array_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                new_element = elementId_array.shift();
                                if (!!searched.includes(new_element)) return [3 /*break*/, 3];
                                if (!(new_element === item_id)) return [3 /*break*/, 1];
                                return [2 /*return*/, { value: false }];
                            case 1: return [4 /*yield*/, twItemModel_2.TwItemSetDetail.findOne({
                                    parentItem: new_element,
                                })];
                            case 2:
                                new_child = _b.sent();
                                new_array_1 = new Array();
                                new_child === null || new_child === void 0 ? void 0 : new_child.element.map(function (obj) {
                                    new_array_1.push(obj.id);
                                });
                                elementId_array = elementId_array.concat(new_array_1);
                                searched.push(new_element);
                                _b.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (!elementId_array.length) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_1()];
            case 2:
                state_1 = _a.sent();
                if (typeof state_1 === "object")
                    return [2 /*return*/, state_1.value];
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, true];
        }
    });
}); };
