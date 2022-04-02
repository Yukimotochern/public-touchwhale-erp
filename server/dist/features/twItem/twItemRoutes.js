"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const errorCatcher_1 = __importDefault(require("../../middlewares/errorCatcher"));
const permissionMiddleware_1 = require("../../middlewares/permissionMiddleware");
const twItemController_1 = require("./twItemController");
const router = express_1.default.Router();
router
    .route('/')
    .all(authMiddleware_1.default)
    .get((0, permissionMiddleware_1.permission)(['tw_item.get_items']), (0, errorCatcher_1.default)(twItemController_1.getItems))
    .post((0, permissionMiddleware_1.permission)(['tw_item.create_item']), (0, errorCatcher_1.default)(twItemController_1.createItem));
router.get('/withDetail', authMiddleware_1.default, (0, permissionMiddleware_1.permission)(['tw_item.get_items_with_detail']), twItemController_1.getItemsWithDetail);
router
    .route('/:id')
    .all(authMiddleware_1.default)
    .get((0, permissionMiddleware_1.permission)(['tw_item.get_item']), (0, errorCatcher_1.default)(twItemController_1.getItem))
    .put((0, permissionMiddleware_1.permission)(['tw_item.update_item']), (0, errorCatcher_1.default)(twItemController_1.updateItem))
    .delete((0, permissionMiddleware_1.permission)(['tw_item.delete_item']), (0, errorCatcher_1.default)(twItemController_1.deleteItem));
router.get('/uploadImage/:id', authMiddleware_1.default, (0, permissionMiddleware_1.permission)(['tw_item.upload_img']), (0, errorCatcher_1.default)(twItemController_1.getB2URL));
router.delete('/uploadImage/:key', authMiddleware_1.default, (0, permissionMiddleware_1.permission)(['tw_item.delete_img']), (0, errorCatcher_1.default)(twItemController_1.deleteItemImage));
exports.default = router;
