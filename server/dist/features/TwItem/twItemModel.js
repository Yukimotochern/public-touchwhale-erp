"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.TwItemSetDetail = exports.TwItem = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * TwItem
 * @doc the basic stock unit.
 * @todo Maybe this model can remember last update user_id
 */
const TwItemSchema = new mongoose_1.default.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    name: {
        type: String,
        trim: true,
    },
    unit: {
        type: String,
        trim: true,
    },
    custom_id: { type: String, trim: true },
    count_stock: {
        type: Boolean,
        default: true,
        required: true,
    },
    image: {
        type: [String],
        default: [],
        required: true,
    },
    item_type: {
        type: 'string',
        enum: ['set', 'element'],
        default: 'element',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
});
TwItemSchema.index({ owner: 1, custom_id: 1 }, { unique: true, sparse: true });
// When TwItem document got remove, if it is a set this pre function will remove TwItemSet document as well
TwItemSchema.pre('remove', async function (next) {
    await this.model('tw_item_set_detail').deleteMany({ parentItem: this._id });
    // remove item from related set
    const sets = await TwItemSetDetail.find({
        members: {
            $elemMatch: {
                member: this._id,
            },
        },
    });
    for (let i = 0; i < sets.length; i++) {
        sets[i].members = sets[i].members.filter((mem) => mem.member !== this.id);
        await sets[i].save();
    }
    next();
});
TwItemSchema.virtual('set_detail', {
    ref: 'tw_item_set_detail',
    localField: '_id',
    foreignField: 'parentItem',
    justOne: true,
});
const TwItem = mongoose_1.default.model('tw_item', TwItemSchema);
exports.TwItem = TwItem;
// TwItemSetDetail
// @doc the combination info of set item
const TwItemSetDetailSchema = new mongoose_1.default.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    parentItem: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'tw_item',
        required: true,
    },
    members: [
        {
            qty: Number,
            member: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'tw_item',
                required: true,
            },
            _id: false,
        },
    ],
}, {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const TwItemSetDetail = mongoose_1.default.model('tw_item_set_detail', TwItemSetDetailSchema);
exports.TwItemSetDetail = TwItemSetDetail;
