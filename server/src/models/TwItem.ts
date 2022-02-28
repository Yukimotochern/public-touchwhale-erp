import mongoose, { Schema, Types } from 'mongoose'

interface TwItemType {
	user: Types.ObjectId
	name: string
	unit: string
	custom_id: string
	count_stock: boolean
	type: string
	// set: Types.ObjectId
}

const TwItemSchema = new mongoose.Schema<TwItemType>({
	user: {
		type: Schema.Types.ObjectId,
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
})

const TwItem = mongoose.model('tw_item', TwItemSchema)

export default TwItem
