import mongoose, { Schema, Types, Document } from 'mongoose'

interface TwItemType {
	user: Types.ObjectId
	name: string
	unit: string
	custom_id: string
	count_stock: boolean
	item_type: string
	// set: Types.ObjectId
}

interface TwItemPayload extends Document {
	name: string
	unit: string
	custom_id: string
	count_stock: boolean
	item_type: string
}

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
		item_type: {
			type: String,
			enum: ['set', 'element'],
			default: 'element',
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

TwItemSchema.index({ user: 1, custom_id: 1 }, { unique: true })

TwItemSchema.virtual('setOfElements', {
	ref: 'tw_item_set_detail',
	localField: '_id',
	foreignField: 'element',
	justOne: true,
})

const TwItem = mongoose.model('tw_item', TwItemSchema)

export { TwItemType, TwItemPayload }

export default TwItem
