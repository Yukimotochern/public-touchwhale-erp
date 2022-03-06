import ajvInstance from '../../utils/ajv'
import { JSONSchemaType } from 'ajv'

import { addItemBodyType } from './twItemType'

const addItemBodySchema: JSONSchemaType<addItemBodyType> = {
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
			},
		},
	},
	required: [],
	additionalProperties: false,
}

const addItemValidator = ajvInstance.compile(addItemBodySchema)

export { addItemValidator }
