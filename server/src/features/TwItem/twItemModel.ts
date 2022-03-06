import mongoose, { Schema } from 'mongoose'
import { TwItemType, TwItemSetDetailType } from './twItemType'

// TwItem
// @doc the basic stock unit.

// @todo Maybe this model can remember last update user_id
const TwItemSchema = new mongoose.Schema<TwItemType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'regular_user',
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

TwItemSchema.index({ user: 1, custom_id: 1 }, { unique: true })

// When TwItem document got remove, if it is a set this pre function will remove TwItemSet document as well
TwItemSchema.pre('remove', async function (next) {
  await this.model('tw_item_set_detail').deleteMany({ parentItem: this._id })
  next()
})

TwItemSchema.virtual('setOfElement', {
  ref: 'tw_item_set_detail',
  localField: '_id',
  foreignField: 'parentItem',
  justOne: true,
})

const TwItem = mongoose.model('tw_item', TwItemSchema)

// TwItemSetDetail
// @doc the combination info of set item

const TwItemSetDetailSchema = new mongoose.Schema<TwItemSetDetailType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'regular_user',
    required: true,
  },
  parentItem: {
    type: Schema.Types.ObjectId,
    ref: 'tw_item',
    required: true,
  },
  element: [Object],
})

const TwItemSetDetail = mongoose.model(
  'tw_item_set_detail',
  TwItemSetDetailSchema
)

export { TwItem, TwItemSetDetail }
