"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.deleteItemImage = exports.getB2URL = exports.getItem = exports.createItem = exports.getItems = exports.getItemsWithDetail = void 0;
// Models
const twItemModel_1 = require("./twItemModel");
const twItemModel_2 = require("./twItemModel");
// advanced result
const advancedResultApi_1 = require("api/dist/advancedResult/advancedResultApi");
// Utils modules
const b2_1 = require("../../utils/AWS/b2");
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const uuid_1 = require("uuid");
const twItemApi_1 = require("api/dist/twItem/twItemApi");
const ajv_1 = require("api/dist/utils/ajv");
const api_1 = require("api/dist/api");
const ItemImageKeyPrifix = 'TwItemImage';
const API = new api_1.api();
/**
 * @route  GET api/v1/twItem/withDetail
 * @desc   Get all items with specific owner, populate the virtual detail
 * @access Private
 */
const getItemsWithDetail = async (req, res, next) => {
    const advancedQuery = new advancedResultApi_1.AdvancedResultApi(req, twItemModel_1.TwItem);
    const twItemWithDetail = await advancedQuery.query.populate({
        path: 'set_detail',
        populate: {
            path: 'members',
            model: 'tw_item_set_detail',
            populate: {
                path: 'member',
            },
        },
    });
    const result = await advancedQuery.result(twItemWithDetail);
    return twItemApi_1.GetItemsWithDetail.API.sendData(res, result);
};
exports.getItemsWithDetail = getItemsWithDetail;
/**
 * @route  GET api/v1/twItem
 * @desc   Get all items with specific owner
 * @access Private
 */
const getItems = async (req, res, next) => {
    const advancedQuery = new advancedResultApi_1.AdvancedResultApi(req, twItemModel_1.TwItem);
    const twItem = await advancedQuery.query;
    const result = await advancedQuery.result(twItem);
    return twItemApi_1.GetItems.API.sendData(res, result);
};
exports.getItems = getItems;
/**
 * @route    POST api/v1/twItem/
 * @desc     Create a TwItem
 * @access   Private
 */
const createItem = async (req, res, next) => {
    if (twItemApi_1.CreateItem.API.bodyValidator(req.body) && req.userJWT) {
        const { twItem, members } = req.body;
        const { name, item_type } = twItem;
        const item_for_owner = await twItemModel_1.TwItem.findOne({
            owner: req.userJWT.owner,
            name: name && name.trim(),
        });
        if (item_for_owner) {
            return next(new CustomError_1.default(`You have a item with same name: '${name}' `, 409));
        }
        if (item_type === 'element' && members) {
            return next(new CustomError_1.default('You can not set element into single item.'));
        }
        if (item_type === 'set' && !members) {
            return next(new CustomError_1.default('You must provide set details for item of type set.'));
        }
        const item = new twItemModel_1.TwItem({
            owner: req.userJWT.owner,
            ...twItem,
        });
        await item.save();
        if (item_type === 'set') {
            const set = new twItemModel_2.TwItemSetDetail({
                owner: req.userJWT.id,
                parentItem: item._id,
                members,
            });
            await set.save();
        }
        const populatedItem = await item.populate({
            path: 'set_detail',
            populate: {
                path: 'members',
                model: 'tw_item_set_detail',
                populate: {
                    path: 'member',
                },
            },
        });
        return twItemApi_1.CreateItem.API.sendData(res, populatedItem);
    }
    else {
        return next((0, ajv_1.avjErrorWrapper)(twItemApi_1.CreateItem.API.bodyValidator.errors));
    }
};
exports.createItem = createItem;
/**
 * @route    GET api/v1/twItem/:id
 * @desc     Get single item by id, with member populated
 * @access   Private
 */
const getItem = async (req, res, next) => {
    if (req.userJWT) {
        let item = await twItemModel_1.TwItem.findOne({
            owner: req.userJWT.owner,
            _id: req.params.id,
        });
        if (!item) {
            return next(new CustomError_1.default('Item not found.', 404));
        }
        const populateItem = await item.populate({
            path: 'set_detail',
            populate: {
                path: 'members',
                model: 'tw_item_set_detail',
                populate: {
                    path: 'member',
                },
            },
        });
        return twItemApi_1.GetItem.API.sendData(res, populateItem);
    }
    return next(new CustomError_1.default('This route should be private.'));
};
exports.getItem = getItem;
/**
 * @route    GET api/v1/twItem/uploadImage/:id
 * @desc     Get B2 url for frontend to make a put request
 * @access   Private
 */
const getB2URL = async (req, res, next) => {
    if (req.userJWT) {
        const itemId = req.params.id;
        const item = await twItemModel_1.TwItem.findOne({
            owner: req.userJWT?.owner,
            _id: req.params.id,
        });
        if (!item) {
            return next(new CustomError_1.default('Item not found.', 404));
        }
        const { Key, url } = await (0, b2_1.uploadImage)(ItemImageKeyPrifix, `${itemId}/${(0, uuid_1.v4)()}`);
        let image = `https://tw-user-data.s3.us-west-000.backblazeb2.com/${Key}`;
        twItemApi_1.GetImageUploadUrl.API.sendData(res, { uploadUrl: url, image });
    }
    return next(new CustomError_1.default('This route should be private.'));
};
exports.getB2URL = getB2URL;
/**
 *  @route    DELETE api/v1/twItem/uploadImage/:key
 *  @desc     Delete image
 *  @access   Private
 */
const deleteItemImage = async (req, res, next) => {
    await (0, b2_1.deleteImage)(ItemImageKeyPrifix, req.params.key);
    return API.send(res, 200, { message: 'Image deleted.' });
};
exports.deleteItemImage = deleteItemImage;
/**
 * @route    PUT api/v1/twItem/:id
 * @desc     Update item by id
 * @access   Private
 */
const updateItem = async (req, res, next) => {
    if (!req.userJWT?.id) {
        return next(new CustomError_1.default('Invalid credentials.', 401));
    }
    if (twItemApi_1.UpdateItem.API.bodyValidator(req.body)) {
        let item = await twItemModel_1.TwItem.findOne({
            owner: req.userJWT.owner,
            _id: req.params.id,
        });
        if (!item) {
            return next(new CustomError_1.default('Item not found.', 404));
        }
        let populatedItem = await item.populate({
            path: 'set_detail',
            populate: {
                path: 'members',
                model: 'tw_item_set_detail',
                populate: {
                    path: 'member',
                },
            },
        });
        // User want to change these fields
        const { twItem, members } = req.body;
        // checks first
        if (twItem) {
            const { name, item_type } = twItem;
            if (name) {
                const item_with_same_name_and_owner = await twItemModel_1.TwItem.findOne({
                    user: req.userJWT.owner,
                    name: name.trim(),
                });
                if (item_with_same_name_and_owner &&
                    String(item_with_same_name_and_owner._id) !== req.params.id) {
                    return next(new CustomError_1.default(`You have another item with same name: '${name}' `, 409));
                }
            }
            if (item_type) {
                populatedItem.item_type = item_type;
            }
        }
        if (members) {
            if (populatedItem.item_type === 'element') {
                return next(new CustomError_1.default('You cannot set members for item with element type.', 422));
            }
            if (!(await check_no_loop(members, populatedItem._id, String(req.userJWT.owner)))) {
                return next(new CustomError_1.default('The updates to the member field will incur a loop.'));
            }
        }
        else {
            if (populatedItem.item_type === 'set' && !populatedItem.set_detail) {
                return next(new CustomError_1.default('You must set members for item of set type', 422));
            }
        }
        if (twItem) {
            /**
             * ! noticed that the populatedItem will the be newer version and still populated
             * ! after the below command but the populated data may not the be new version.
             */
            await populatedItem.updateOne(twItem, {
                runValidators: true,
                returnDocument: 'after',
            });
        }
        if (members) {
            await twItemModel_2.TwItemSetDetail.findOneAndUpdate({ owner: req.userJWT.owner, parentItem: populatedItem._id }, { $set: { members } }, { upsert: true, runValidators: true });
        }
        else if (populatedItem.item_type === 'element' &&
            populatedItem.set_detail) {
            await twItemModel_2.TwItemSetDetail.deleteMany({
                owner: req.userJWT.owner,
                parentItem: populatedItem._id,
            });
        }
        // things are updated, query again
        let new_item = await twItemModel_1.TwItem.findOne({
            owner: req.userJWT.owner,
            _id: req.params.id,
        });
        if (!new_item) {
            return next(new CustomError_1.default('Item not found.', 404));
        }
        let newItemWithSetDetailPopulated = await new_item.populate({
            path: 'set_detail',
            populate: {
                path: 'members',
                model: 'tw_item_set_detail',
                populate: {
                    path: 'member',
                },
            },
        });
        return twItemApi_1.UpdateItem.API.sendData(res, newItemWithSetDetailPopulated);
    }
    else {
        return next((0, ajv_1.avjErrorWrapper)(twItemApi_1.UpdateItem.API.bodyValidator.errors));
    }
};
exports.updateItem = updateItem;
/**
 * @route    DELETE api/v1/twItem/:id
 * @desc     Update item by id
 * @access   Private
 */
const deleteItem = async (req, res, next) => {
    const item = await twItemModel_1.TwItem.findOne({
        owner: req.userJWT?.owner,
        _id: req.params.id,
    });
    if (!item) {
        return next(new CustomError_1.default('Item not found.', 404));
    }
    await item.delete();
    return API.send(res, 200, { message: 'Item deleted.' });
};
exports.deleteItem = deleteItem;
const check_no_loop = async (members, item_id_get, owner) => {
    let item_id = String(item_id_get);
    let membersIdArray = members.map((mem) => String(mem.member));
    let searched = [];
    while (membersIdArray.length) {
        const new_member = membersIdArray.pop(); // pop is easier to do
        if (!new_member)
            break;
        if (!searched.includes(new_member)) {
            if (new_member === item_id) {
                return false;
            }
            else {
                const new_child = await twItemModel_2.TwItemSetDetail.findOne({
                    owner,
                    parentItem: new_member,
                });
                if (new_child) {
                    membersIdArray = membersIdArray.concat(new_child.members.map((mem) => String(mem.member)));
                }
                searched.push(new_member);
            }
        }
    }
    return true;
};
