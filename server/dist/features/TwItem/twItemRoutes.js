"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
// import itemOwnerMiddleware from '../../middlewares/itemOwnerMiddleware'  2022/3/18 deprecated
var advancedResult_1 = __importDefault(require("../../middlewares/advancedResult"));
var errorCatcher_1 = __importDefault(require("../../middlewares/errorCatcher"));
var twItemController_1 = require("./twItemController");
var twItemModel_1 = require("./twItemModel");
var router = express_1.default.Router();
// @todo twItem routes supposed to handle diff user access right.
router
    .route('/')
    .all(authMiddleware_1.default)
    .get([(0, advancedResult_1.default)(twItemModel_1.TwItem, 'setOfElement')], (0, errorCatcher_1.default)(twItemController_1.getItems))
    .post((0, errorCatcher_1.default)(twItemController_1.addItem));
router
    .route('/:id')
    .all(authMiddleware_1.default)
    .get((0, errorCatcher_1.default)(twItemController_1.getItem))
    .put((0, errorCatcher_1.default)(twItemController_1.updateItem))
    .delete((0, errorCatcher_1.default)(twItemController_1.deleteItem));
router.route('/uploadImage/:id').get([authMiddleware_1.default], (0, errorCatcher_1.default)(twItemController_1.getB2URL));
exports.default = router;
