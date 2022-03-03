import ajvInstance from '../../utils/ajv'
import { TwItemType } from '../../models/TwItem'
import { JSONSchemaType } from 'ajv'

interface TwItemEditableType extends Omit<TwItemType, 'user'> {}

const addItemBodySchema: JSONSchemaType<TwItemEditableType> = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		unit: { type: 'string' },
		custom_id: { type: 'string' },
		count_stock: { type: 'boolean' },
		item_type: { type: 'string' },
	},
	required: [],
	additionalProperties: false,
}

const addItemValidator = ajvInstance.compile(addItemBodySchema)

export { addItemValidator }
