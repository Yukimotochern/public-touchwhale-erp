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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwItemSetDetail = exports.TwItem = void 0;
var mongoose_1 = __importStar(require("mongoose"));
// TwItem
// @doc the basic stock unit.
// @todo Maybe this model can remember last update user_id
var TwItemSchema = new mongoose_1.default.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    name: {
        type: String,
        // unique: true,
        trim: true,
    },
    unit: {
        type: String,
        trim: true,
    },
    custom_id: { type: String, trim: true, required: true },
    count_stock: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
    },
    item_type: { type: 'string', enum: ['set', 'element'] },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.id;
        },
    },
    toObject: { virtuals: true },
});
TwItemSchema.index({ user: 1, custom_id: 1 }, { unique: true });
// When TwItem document got remove, if it is a set this pre function will remove TwItemSet document as well
TwItemSchema.pre('remove', function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var related_element;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.model('tw_item_set_detail').deleteMany({ parentItem: this._id })
                    // find all related element and remove thid._id element if this is in element
                ];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, TwItemSetDetail.find()];
                case 2:
                    related_element = _a.sent();
                    related_element.map(function (set_info) {
                        var element_array = set_info.element;
                        element_array.map(function (obj, index) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(obj.id === this._id.toString())) return [3 /*break*/, 2];
                                        set_info.element.splice(index, 1);
                                        return [4 /*yield*/, set_info.save()];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
TwItemSchema.virtual('setOfElement', {
    ref: 'tw_item_set_detail',
    localField: '_id',
    foreignField: 'parentItem',
    justOne: true,
});
var TwItem = mongoose_1.default.model('tw_item', TwItemSchema);
exports.TwItem = TwItem;
// TwItemSetDetail
// @doc the combination info of set item
var TwItemSetDetailSchema = new mongoose_1.default.Schema({
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
    element: [Object],
});
var TwItemSetDetail = mongoose_1.default.model('tw_item_set_detail', TwItemSetDetailSchema);
exports.TwItemSetDetail = TwItemSetDetail;
