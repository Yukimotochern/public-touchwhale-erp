import mongoose, { Schema, Query } from 'mongoose'
import { TwItemType, TwItemSetDetailType } from 'api/dist/twItem/twItemTypes'

/**
 * TwItem
 * @doc the basic stock unit.
 * @todo Maybe this model can remember last update user_id
 */
const TwItemSchema = new mongoose.Schema<TwItemType.TwItem>(
  {
    owner: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
)

TwItemSchema.index({ owner: 1, custom_id: 1 }, { unique: true, sparse: true })

// When TwItem document got remove, if it is a set this pre function will remove TwItemSet document as well
TwItemSchema.pre('remove', async function (next) {
  await this.model('tw_item_set_detail').deleteMany({ parentItem: this._id })

  // remove item from related set
  const sets = await TwItemSetDetail.find({
    members: {
      $elemMatch: {
        member_id: this._id,
      },
    },
  })
  for (let i = 0; i < sets.length; i++) {
    sets[i].members = sets[i].members.filter((mem) => mem.member_id !== this.id)
    await sets[i].save()
  }

  next()
})

TwItemSchema.virtual('set_detail', {
  ref: 'tw_item_set_detail',
  localField: '_id',
  foreignField: 'parentItem',
  justOne: true,
})

const TwItem = mongoose.model('tw_item', TwItemSchema)

// TwItemSetDetail
// @doc the combination info of set item

const TwItemSetDetailSchema =
  new mongoose.Schema<TwItemSetDetailType.TwItemSetDetail>(
    {
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      parentItem: {
        type: Schema.Types.ObjectId,
        ref: 'tw_item',
        required: true,
      },
      members: [
        {
          qty: Number,
          member_id: {
            type: Schema.Types.ObjectId,
            ref: 'tw_item',
            required: true,
          },
          _id: false,
        },
      ],
    },
    { timestamps: true, id: false }
  )

const TwItemSetDetail = mongoose.model(
  'tw_item_set_detail',
  TwItemSetDetailSchema
)

export { TwItem, TwItemSetDetail }
