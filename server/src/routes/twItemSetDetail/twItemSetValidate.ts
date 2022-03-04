import ajvInstance from '../../utils/ajv'
import { TwItemSetDetailType } from '../../models/TwItemSetDetail'
import { JSONSchemaType } from 'ajv'

interface TwItemSetType {
	element: Array<object>
}

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
				properties: { quantity: 'number', objectId: 'string' },
			},
		},
	},
	required: [],
	additionalProperties: false,
}

const itemSetValidator = ajvInstance.compile(itemSetBodySchema)

export { itemSetValidator }
