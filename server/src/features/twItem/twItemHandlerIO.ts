import { JSONSchemaType } from 'ajv'
import { ItemType } from './twItemType'
import {
	MongooseStaticsJSONSchema,
	MongooseStampsJSONSchema,
} from '../../utils/mongodb'
import { HandlerIO } from '../apiIO'

export namespace ItemIO {
	const plainItemSchema: JSONSchemaType<ItemType.PlainItem> = {
		type: 'object',
		properties: {
			...MongooseStaticsJSONSchema,
			...MongooseStampsJSONSchema,
			name: { type: 'string' },
			unit: { type: 'string' },
			custom_id: { type: 'string' },
			count_stock: { type: 'boolean' },
			item_type: { type: 'string' },
			owner: { type: 'string' },
			image: { type: 'string' },
			element: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						qty: { type: 'number' },
						id: { type: 'string' },
					},
					required: ['id', 'qty'],
				},
			},
		},
		required: [],
		additionalProperties: true,
	}

	// const addItemSehema: JSONSchemaType<ItemType.addItemBodyType> = {
	//   type: 'object',
	//   properties: {

	//   }
	// }

	const addItemBodySchema: JSONSchemaType<ItemType.addItemBodyType> = {
		type: 'object',
		properties: {
			name: { type: 'string' },
			unit: { type: 'string' },
			custom_id: { type: 'string' },
			count_stock: { type: 'boolean' },
			item_type: { type: 'string' },
			// element will store in TwItemSetDetail model
			element: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						qty: { type: 'number' },
						id: { type: 'string' },
					},
					required: ['id', 'qty'],
				},
			},
		},
		required: ['name'],
		additionalProperties: false,
	}

	export class AddItem extends HandlerIO {
		static bodyValidator = super.bodyValidatorCreator<ItemType.AddItem.Body>(
			addItemBodySchema
		)
		static sendData = super.sendDataCreator<ItemType.AddItem.Data>(
			plainItemSchema
		)
	}

	export class UpdateItem extends HandlerIO {
		static bodyValidator = super.bodyValidatorCreator<ItemType.UpdateItem.Body>(
			addItemBodySchema
		)
		static sendData = super.sendDataCreator<ItemType.UpdateItem.Data>(
			plainItemSchema
		)
	}

	export class GetItem extends HandlerIO {
		static sendData = super.sendDataCreator<ItemType.GetItem.Data>(
			plainItemSchema
		)
	}

	export class GetImageUploadUrl extends HandlerIO {
		static sendData = super.sendDataCreator<ItemType.GetImageUploadUrl.Data>({
			type: 'object',
			properties: {
				image: { type: 'string' },
				uploadUrl: { type: 'string' },
			},
			required: ['image', 'uploadUrl'],
			additionalProperties: false,
		})
	}
}
