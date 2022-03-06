import ajvInstance from '../../utils/ajv'
import { JSONSchemaType } from 'ajv'

import { addItemBodyType, TwItemSetType } from './twItemType'

// twItem

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
				required: ['id', 'qty'],
			},
		},
	},
	required: [],
	additionalProperties: false,
}

const addItemValidator = ajvInstance.compile(addItemBodySchema)

// twItemSetDetailValidate

// interface elementInnerType {
// 	items: string
// }

// const elementInnerSchema: JSONSchemaType<elementInnerType = {
// 	type: 'array',
// 	properties: {
// 		items: { type: 'string' },
// 	},
// 	required: [],
// 	additionalProperties: false,
// }

const itemSetBodySchema: JSONSchemaType<TwItemSetType> = {
	type: 'object',
	properties: {
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

const itemSetValidator = ajvInstance.compile(itemSetBodySchema)

export { itemSetValidator, addItemValidator }
