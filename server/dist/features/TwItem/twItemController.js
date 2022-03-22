"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.deleteItemImage = exports.getB2URL = exports.getItem = exports.addItem = exports.getItems = void 0;
// Models
const twItemModel_1 = require("./twItemModel");
const twItemModel_2 = require("./twItemModel");
// Utils modules
const b2_1 = require("../../utils/AWS/b2");
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const twItemHandlerIO_1 = require("./twItemHandlerIO");
const apiIO_1 = require("../apiIO");
const ajv_1 = require("../../utils/ajv");
const { AddItem, UpdateItem, GetItem, GetImageUploadUrl } = twItemHandlerIO_1.ItemIO;
const ItemImageKeyPrifix = 'TwItemImage';
// @route    GET api/v1/twItem/
// @desc     Get all items with specific user
// @access   Private
const getItems = async (req, res, next) => {
    res.status(200).json(res.advancedResults);
};
exports.getItems = getItems;
// @route    POST api/v1/twItem/
// @desc     Add a item and ref to user
// @access   Private
const addItem = async (req, res, next) => {
    if (AddItem.bodyValidator(req.body) && req.userJWT?.id) {
        const { name, unit, custom_id, count_stock, item_type, element } = req.body;
        const item_for_user = await twItemModel_1.TwItem.findOne({
            user: req.userJWT.id,
            name: name.trim(),
        });
        if (item_for_user) {
            return next(new CustomError_1.default(`You have a item with same name: \'${name}\' `));
        }
        if (item_type === 'element' && element) {
            return next(new CustomError_1.default('You can not set element into single item.'));
        }
        const item = new twItemModel_1.TwItem({
            owner: req.userJWT.id,
            name,
            unit,
            custom_id,
            count_stock,
            item_type,
        });
        await item.save();
        if (item_type === 'set') {
            await item.save();
            const set = new twItemModel_2.TwItemSetDetail({
                user: req.userJWT.id,
                parentItem: item._id,
                element,
            });
            await set.save();
        }
        return AddItem.sendData(res, item);
    }
    else {
        return next((0, ajv_1.avjErrorWrapper)(AddItem.bodyValidator.errors));
    }
};
exports.addItem = addItem;
// "element": [{"qty": 2, "id": "62241c8f7096ddea6783e41a"}, {"qty": 3, "id": "622392fbafbb949826bd2a07"}]
// @route    GET api/v1/twItem/:id
// @desc     Get single item by item's id
// @access   Private
const getItem = async (req, res, next) => {
    const populate = req.query.populate;
    let query = twItemModel_1.TwItem.findOne({
        owner: req.userJWT?.owner,
        _id: req.params.id,
    });
    if (populate) {
        query = query.populate('setOfElement', 'element');
    }
    const item = await query;
    if (!item) {
        return next(new CustomError_1.default('Item not found.', 404));
    }
    GetItem.sendData(res, item);
};
exports.getItem = getItem;
// @route    GET api/v1/twItem/uploadImage/:id
// @desc     Get B2 url for frontend to make a put request
// @access   Private
const getB2URL = async (req, res, next) => {
    const itemId = req.params.id;
    const item = await twItemModel_1.TwItem.findOne({
        owner: req.userJWT?.owner,
        _id: req.params.id,
    });
    if (!item) {
        return next(new CustomError_1.default('Item not found.', 404));
    }
    const { Key, url } = await (0, b2_1.uploadImage)(ItemImageKeyPrifix, itemId);
    let image = `https://tw-user-data.s3.us-west-000.backblazeb2.com/${Key}`;
    item.image = image;
    await item.save();
    // res.status(200).send({ msg: result })
    GetImageUploadUrl.sendData(res, { uploadUrl: url, image });
};
exports.getB2URL = getB2URL;
// @route    DELETE api/v1/twItem/uploadImage/:id
// @desc     Delete item's image
// @access   Private
const deleteItemImage = async (req, res, next) => {
    const item = await twItemModel_1.TwItem.findOne({
        owner: req.userJWT?.owner,
        _id: req.params.id,
    });
    if (!item) {
        return next(new CustomError_1.default('Item not found.', 404));
    }
    await (0, b2_1.deleteImage)(ItemImageKeyPrifix, item.id);
    item.image = '';
    await item.save();
    return apiIO_1.HandlerIO.send(res, 200, { message: 'Image deleted.' });
};
exports.deleteItemImage = deleteItemImage;
// @route    PUT api/v1/twItem/:id
// @desc     Update item by item's id
// @access   Private
const updateItem = async (req, res, next) => {
    if (!req.userJWT?.id) {
        return next(new CustomError_1.default('Invalid credentials.', 401));
    }
    if (UpdateItem.bodyValidator(req.body)) {
        let item = await twItemModel_1.TwItem.findOne({
            owner: req.userJWT?.owner,
            _id: req.params.id,
        });
        if (!item) {
            return next(new CustomError_1.default('Item not found.', 404));
        }
        // User want to change these fields
        const { name, unit, custom_id, count_stock, item_type, element } = req.body;
        // Find if user has a item's name that same with req.body
        const item_for_user = await twItemModel_1.TwItem.findOne({
            user: req.userJWT.id,
            name: name.trim(),
        });
        // Check if that item not equal with item(/:id)
        if (item_for_user?.custom_id &&
            item_for_user?.custom_id !== item.custom_id) {
            return next(new CustomError_1.default(`You have a item with same name: \'${name}\' `));
        }
        if (item_type === 'element' && element) {
            return next(new CustomError_1.default('You can not set element into single intem.'));
        }
        item.name = name ? name : item.name;
        item.unit = unit ? unit : item.unit;
        item.custom_id = custom_id ? custom_id : item.custom_id;
        item.count_stock = count_stock ? count_stock : item.count_stock;
        item.item_type = item_type ? item_type : item.item_type;
        console.log(element);
        try {
            if (element) {
                if (await check_no_loop(element, item.id)) {
                    let itemSetElement = await twItemModel_2.TwItemSetDetail.findOne({
                        owner: req.userJWT.owner,
                        parentItem: item.id,
                    });
                    if (itemSetElement) {
                        itemSetElement.element = element;
                        await itemSetElement.save();
                    }
                    else {
                        const set = new twItemModel_2.TwItemSetDetail({
                            owner: req.userJWT.id,
                            parentItem: item._id,
                            element,
                        });
                        await set.save();
                    }
                }
                else {
                    return next(new CustomError_1.default('Items element has a loop. '));
                }
            }
            await item.save();
            // res.status(200).json({ data: item })
            UpdateItem.sendData(res, item);
        }
        catch (err) {
            return next(new CustomError_1.default('Something wrong. Maybe there has duplicate field in your items', 401, err));
        }
    }
    else {
        return next((0, ajv_1.avjErrorWrapper)(UpdateItem.bodyValidator.errors));
    }
};
exports.updateItem = updateItem;
// @route    DELETE api/v1/twItem/:id
// @desc     Update item by item's id
// @access   Private
const deleteItem = async (req, res, next) => {
    const item = await twItemModel_1.TwItem.findOne({
        owner: req.userJWT?.owner,
        _id: req.params.id,
    });
    if (!item) {
        return next(new CustomError_1.default('Item not found.', 404));
    }
    item.delete();
    return apiIO_1.HandlerIO.send(res, 200, { message: 'Item deleted.' });
};
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
const check_no_loop = async (element, item_id) => {
    let elementId_array = new Array();
    element.map((ele) => {
        elementId_array.push(ele.id);
    });
    let searched = new Array();
    while (elementId_array.length) {
        const new_element = elementId_array.shift();
        if (!searched.includes(new_element)) {
            if (new_element === item_id) {
                return false;
            }
            else {
                const new_child = await twItemModel_2.TwItemSetDetail.findOne({
                    parentItem: new_element,
                });
                const new_array = new Array();
                new_child?.element.map((obj) => {
                    new_array.push(obj.id);
                });
                elementId_array = elementId_array.concat(new_array);
                searched.push(new_element);
            }
        }
    }
    return true;
};
