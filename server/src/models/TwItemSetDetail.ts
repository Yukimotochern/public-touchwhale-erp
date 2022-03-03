import { Type } from 'aws-sdk/clients/cloudformation'
import mongoose, { Types, Schema } from 'mongoose'

interface TwItemSetDetailType {
	user: Types.ObjectId
	parentItem: Types.ObjectId
	element: Array<Object>
}

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

export { TwItemSetDetailType }

export default TwItemSetDetail
