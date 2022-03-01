"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var TwItemSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'regular_user',
        required: true,
    },
    name: {
        type: String,
        unique: true,
        trim: true,
    },
    unit: {
        type: String,
        trim: true,
    },
    custom_id: { tupe: String, unique: true, trim: true, required: true },
    count_stock: {
        type: Boolean,
        required: true,
    },
    type: {
        type: String,
        enum: ['set', 'element'],
        default: 'element',
    },
    // set: {
    // 	type: Schema.Types.ObjectId,
    // 	ref: 'tw_item_set_detail',
    // },
    // wait for TwItemSetDetail schema
});
var TwItem = mongoose_1.default.model('tw_item', TwItemSchema);
exports.default = TwItem;
