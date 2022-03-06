"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
var itemOwnerMiddleware_1 = __importDefault(require("../../middlewares/itemOwnerMiddleware"));
var advancedResult_1 = __importDefault(require("../../middlewares/advancedResult"));
var errorCatcher_1 = __importDefault(require("../../middlewares/errorCatcher"));
var twItemController_1 = require("./twItemController");
var twItemModel_1 = require("./twItemModel");
var router = express_1.default.Router();
// @todo twItem routes supposed to handle diff user access right.
router
    .route('/')
    .get([authMiddleware_1.default, (0, advancedResult_1.default)(twItemModel_1.TwItem, 'setOfElement')], (0, errorCatcher_1.default)(twItemController_1.getItems))
    .post(authMiddleware_1.default, (0, errorCatcher_1.default)(twItemController_1.addItem));
router
    .route('/:id')
    .get([authMiddleware_1.default, itemOwnerMiddleware_1.default], (0, errorCatcher_1.default)(twItemController_1.getItem))
    .put([authMiddleware_1.default, itemOwnerMiddleware_1.default], (0, errorCatcher_1.default)(twItemController_1.updateItem))
    .delete([authMiddleware_1.default, itemOwnerMiddleware_1.default], (0, errorCatcher_1.default)(twItemController_1.deleteItem));
router
    .route('/uploadImage/:id')
    .get([authMiddleware_1.default, itemOwnerMiddleware_1.default], (0, errorCatcher_1.default)(twItemController_1.getB2URL));
exports.default = router;
