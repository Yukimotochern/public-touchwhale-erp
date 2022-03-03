import ajvInstance from '../../utils/ajv'
import { TwItemType } from '../../models/TwItem'
import { JSONSchemaType } from 'ajv'

interface TwItemEditableType
	extends Omit<TwItemType, 'user' | 'setObject' | 'image'> {}

interface addItemBodyTyep extends TwItemEditableType {
	element: Array<object>
}

const addItemBodySchema: JSONSchemaType<addItemBodyTyep> = {
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
					quantity: { type: 'number' },
					objectId: { type: 'string' },
				},
			},
		},
	},
	required: [],
	additionalProperties: false,
}

const addItemValidator = ajvInstance.compile(addItemBodySchema)

export { addItemValidator }
