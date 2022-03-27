import { JSONSchemaType } from 'ajv'
import { TwItemType, TwItemSetDetailType } from './twItemTypes'
import { api } from '../api'
import {
  MongooseStaticsJSONSchema,
  MongooseStampsJSONSchema,
} from '../utils/mongoTypes'

// const plainTwItemSchema: JSONSchemaType<TwItemType.PlainTwItem> = {
//   type: 'object',
//   properties: {
//     ...MongooseStampsJSONSchema,
//     ...MongooseStaticsJSONSchema,
//     owner: {
//       type: 'string',
//     },
//     name: { type: 'string' },
//     unit: { type: 'string' },
//     custom_id: { type: 'string' },
//     count_stock: { type: 'boolean' },
//     item_type: { type: 'string', enum: ['element', 'set'] },
//     image: { type: 'array', items: { type: 'string' } },
//     element: { type: '' },
//   },
//   required: ['owner'],
//   additionalProperties: false,
// }
