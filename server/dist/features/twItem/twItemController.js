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
exports.deleteItem = exports.updateItem = exports.deleteItemImage = exports.getB2URL = exports.getItem = exports.addItem = exports.getItems = void 0;
// Models
var twItemModel_1 = require("./twItemModel");
var twItemModel_2 = require("./twItemModel");
// Utils modules
var b2_1 = require("../../utils/AWS/b2");
var errorResponse_1 = __importDefault(require("../../utils/errorResponse"));
var twItemHandlerIO_1 = require("./twItemHandlerIO");
var apiIO_1 = require("../apiIO");
var ajv_1 = require("../../utils/ajv");
var AddItem = twItemHandlerIO_1.ItemIO.AddItem, UpdateItem = twItemHandlerIO_1.ItemIO.UpdateItem, GetItem = twItemHandlerIO_1.ItemIO.GetItem, GetImageUploadUrl = twItemHandlerIO_1.ItemIO.GetImageUploadUrl;
var ItemImageKeyPrifix = 'TwItemImage';
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
                if (!(AddItem.bodyValidator(req.body) && ((_b = req.userJWT) === null || _b === void 0 ? void 0 : _b.id))) return [3 /*break*/, 6];
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
                    owner: req.userJWT.id,
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
            case 5: return [2 /*return*/, AddItem.sendData(res, item)];
            case 6: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(AddItem.bodyValidator.errors))];
        }
    });
}); };
exports.addItem = addItem;
// "element": [{"qty": 2, "id": "62241c8f7096ddea6783e41a"}, {"qty": 3, "id": "622392fbafbb949826bd2a07"}]
// @route    GET api/v1/twItem/:id
// @desc     Get single item by item's id
// @access   Private
var getItem = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var populate, query, item;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                populate = req.query.populate;
                query = twItemModel_1.TwItem.findOne({
                    owner: (_a = req.userJWT) === null || _a === void 0 ? void 0 : _a.owner,
                    _id: req.params.id,
                });
                if (populate) {
                    query = query.populate('setOfElement', 'element');
                }
                return [4 /*yield*/, query];
            case 1:
                item = _b.sent();
                if (!item) {
                    return [2 /*return*/, next(new errorResponse_1.default('Item not found.', 404))];
                }
                GetItem.sendData(res, item);
                return [2 /*return*/];
        }
    });
}); };
exports.getItem = getItem;
// @route    GET api/v1/twItem/uploadImage/:id
// @desc     Get B2 url for frontend to make a put request
// @access   Private
var getB2URL = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var itemId, item, _a, Key, url, image;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                itemId = req.params.id;
                return [4 /*yield*/, twItemModel_1.TwItem.findOne({
                        owner: (_b = req.userJWT) === null || _b === void 0 ? void 0 : _b.owner,
                        _id: req.params.id,
                    })];
            case 1:
                item = _c.sent();
                if (!item) {
                    return [2 /*return*/, next(new errorResponse_1.default('Item not found.', 404))];
                }
                return [4 /*yield*/, (0, b2_1.uploadImage)(ItemImageKeyPrifix, itemId)];
            case 2:
                _a = _c.sent(), Key = _a.Key, url = _a.url;
                image = "https://tw-user-data.s3.us-west-000.backblazeb2.com/".concat(Key);
                item.image = image;
                return [4 /*yield*/, item.save()
                    // res.status(200).send({ msg: result })
                ];
            case 3:
                _c.sent();
                // res.status(200).send({ msg: result })
                GetImageUploadUrl.sendData(res, { uploadUrl: url, image: image });
                return [2 /*return*/];
        }
    });
}); };
exports.getB2URL = getB2URL;
// @route    DELETE api/v1/twItem/uploadImage/:id
// @desc     Delete item's image
// @access   Private
var deleteItemImage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var item;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, twItemModel_1.TwItem.findOne({
                    owner: (_a = req.userJWT) === null || _a === void 0 ? void 0 : _a.owner,
                    _id: req.params.id,
                })];
            case 1:
                item = _b.sent();
                if (!item) {
                    return [2 /*return*/, next(new errorResponse_1.default('Item not found.', 404))];
                }
                return [4 /*yield*/, (0, b2_1.deleteImage)(ItemImageKeyPrifix, item.id)];
            case 2:
                _b.sent();
                item.image = '';
                return [4 /*yield*/, item.save()];
            case 3:
                _b.sent();
                return [2 /*return*/, apiIO_1.HandlerIO.send(res, 200, { message: 'Image deleted.' })];
        }
    });
}); };
exports.deleteItemImage = deleteItemImage;
// @route    PUT api/v1/twItem/:id
// @desc     Update item by item's id
// @access   Private
var updateItem = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var item, _a, name_2, unit, custom_id, count_stock, item_type, element, item_for_user, itemSetElement, set, err_1;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!((_b = req.userJWT) === null || _b === void 0 ? void 0 : _b.id)) {
                    return [2 /*return*/, next(new errorResponse_1.default('Invalid credentials.', 401))];
                }
                if (!UpdateItem.bodyValidator(req.body)) return [3 /*break*/, 15];
                return [4 /*yield*/, twItemModel_1.TwItem.findOne({
                        owner: (_c = req.userJWT) === null || _c === void 0 ? void 0 : _c.owner,
                        _id: req.params.id,
                    })];
            case 1:
                item = _d.sent();
                if (!item) {
                    return [2 /*return*/, next(new errorResponse_1.default('Item not found.', 404))];
                }
                _a = req.body, name_2 = _a.name, unit = _a.unit, custom_id = _a.custom_id, count_stock = _a.count_stock, item_type = _a.item_type, element = _a.element;
                return [4 /*yield*/, twItemModel_1.TwItem.findOne({
                        user: req.userJWT.id,
                        name: name_2.trim(),
                    })
                    // Check if that item not equal with item(/:id)
                ];
            case 2:
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
                console.log(element);
                _d.label = 3;
            case 3:
                _d.trys.push([3, 13, , 14]);
                if (!element) return [3 /*break*/, 11];
                return [4 /*yield*/, check_no_loop(element, item.id)];
            case 4:
                if (!_d.sent()) return [3 /*break*/, 10];
                return [4 /*yield*/, twItemModel_2.TwItemSetDetail.findOne({
                        owner: req.userJWT.owner,
                        parentItem: item.id,
                    })];
            case 5:
                itemSetElement = _d.sent();
                if (!itemSetElement) return [3 /*break*/, 7];
                itemSetElement.element = element;
                return [4 /*yield*/, itemSetElement.save()];
            case 6:
                _d.sent();
                return [3 /*break*/, 9];
            case 7:
                set = new twItemModel_2.TwItemSetDetail({
                    owner: req.userJWT.id,
                    parentItem: item._id,
                    element: element,
                });
                return [4 /*yield*/, set.save()];
            case 8:
                _d.sent();
                _d.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10: return [2 /*return*/, next(new errorResponse_1.default('Items element has a loop. '))];
            case 11: return [4 /*yield*/, item.save()
                // res.status(200).json({ data: item })
            ];
            case 12:
                _d.sent();
                // res.status(200).json({ data: item })
                UpdateItem.sendData(res, item);
                return [3 /*break*/, 14];
            case 13:
                err_1 = _d.sent();
                return [2 /*return*/, next(new errorResponse_1.default('Something wrong. Maybe there has duplicate field in your items', 401, err_1))];
            case 14: return [3 /*break*/, 16];
            case 15: return [2 /*return*/, next((0, ajv_1.avjErrorWrapper)(UpdateItem.bodyValidator.errors))];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.updateItem = updateItem;
// @route    DELETE api/v1/twItem/:id
// @desc     Update item by item's id
// @access   Private
var deleteItem = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var item;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, twItemModel_1.TwItem.findOne({
                    owner: (_a = req.userJWT) === null || _a === void 0 ? void 0 : _a.owner,
                    _id: req.params.id,
                })];
            case 1:
                item = _b.sent();
                if (!item) {
                    return [2 /*return*/, next(new errorResponse_1.default('Item not found.', 404))];
                }
                item.delete();
                return [2 /*return*/, apiIO_1.HandlerIO.send(res, 200, { message: 'Item deleted.' })];
        }
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
var check_no_loop = function (element, item_id) { return __awaiter(void 0, void 0, void 0, function () {
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
