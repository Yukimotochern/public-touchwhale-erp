import { JSONSchemaType } from 'ajv'
import { TwItemType, TwItemSetDetailType } from './twItemTypes'
import { api } from '../api'
import { commonSchema } from '../utils/commonJSON'
import {
  AdvancedResult,
  getAdvancedResultSchema,
} from '../advancedResult/advancedResultTypes'

// Set detail
export const members = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      qty: { type: 'integer' },
      member_id: { type: 'string' },
    },
    required: ['member_id', 'qty'],
    additionalProperties: false,
  },
} as const
export const twItemSetDetailConstSchema = {
  type: 'object',
  properties: {
    ...commonSchema,
    parentItem: { type: 'string' },
    members,
  },
  required: ['owner', 'parentItem'],
  additionalProperties: false,
} as const
export const twItemSetDetailSchema: JSONSchemaType<TwItemSetDetailType.TwItemSetDetail> =
  twItemSetDetailConstSchema

// definite properties for twItem
export const editableProperties = {
  name: { type: 'string', nullable: true },
  unit: { type: 'string', nullable: true },
  custom_id: { type: 'string', nullable: true },
  count_stock: { type: 'boolean' },
  item_type: { type: 'string', enum: ['element', 'set'] },
  image: { type: 'array', items: { type: 'string' }, nullable: true },
} as const
export const twItemDefiniteProperties = {
  ...commonSchema,
  ...editableProperties,
} as const

// Without detail
const twItemSchema: JSONSchemaType<TwItemType.TwItem> = {
  type: 'object',
  properties: {
    ...twItemDefiniteProperties,
  },
  required: ['owner', 'count_stock', 'item_type', 'image'],
  additionalProperties: false,
}

// With detail
export const twItemWithSetDetailSchema: JSONSchemaType<TwItemType.TwItemWithSetDetail> =
  {
    type: 'object',
    properties: {
      ...twItemDefiniteProperties,
      set_detail: { ...twItemSetDetailConstSchema, nullable: true },
    },
    required: ['owner', 'count_stock', 'item_type', 'image', 'set_detail'],
    additionalProperties: false,
  }

export namespace CreateItem {
  export interface Body {
    twItem: TwItemType.Editable
    members?: TwItemSetDetailType.SetMember[]
  }
  export type Data = TwItemType.TwItemWithSetDetail
  export const API = new api<Body, Data>({
    bodySchema: {
      type: 'object',
      properties: {
        twItem: {
          type: 'object',
          properties: editableProperties,
          required: ['count_stock', 'item_type'],
          additionalProperties: false,
        },
        members: { ...members, nullable: true },
      },
      required: ['twItem'],
    },
    dataSchema: twItemWithSetDetailSchema,
  })
}

export namespace UpdateItem {
  export interface Body {
    twItem?: Partial<TwItemType.Editable>
    members?: TwItemSetDetailType.SetMember[]
  }
  export type Data = TwItemType.TwItemWithSetDetail
  export const API = new api<Body, Data>({
    bodySchema: {
      type: 'object',
      properties: {
        twItem: {
          type: 'object',
          properties: {
            ...editableProperties,
            count_stock: { type: 'boolean', nullable: true },
            item_type: {
              type: 'string',
              enum: ['element', 'set'],
              nullable: true,
            },
            image: { type: 'array', items: { type: 'string' }, nullable: true },
          },
          additionalProperties: false,
          nullable: true,
        },
        members: { ...members, nullable: true },
      },
    },
    dataSchema: twItemWithSetDetailSchema,
  })
}

export namespace GetItem {
  export type Data = TwItemType.TwItemWithSetDetail
  export const API = new api<any, Data>({
    dataSchema: twItemWithSetDetailSchema,
  })
}

export namespace GetItemsWithDetail {
  export type Data = AdvancedResult<TwItemType.TwItemWithSetDetail[]>
  export const API = new api<any, Data>().setDataValidator(
    getAdvancedResultSchema<TwItemType.TwItemWithSetDetail[]>({
      type: 'array',
      items: twItemWithSetDetailSchema,
    })
  )
}

export namespace GetItems {
  export type Data = AdvancedResult<TwItemType.TwItem[]>
  export const API = new api<any, Data>().setDataValidator(
    getAdvancedResultSchema<TwItemType.TwItem[]>({
      type: 'array',
      items: twItemSchema,
    })
  )
}

export namespace GetImageUploadUrl {
  export interface Data {
    image: string
    uploadUrl: string
  }
  export const API = new api<any, Data>({
    dataSchema: {
      type: 'object',
      properties: {
        image: { type: 'string' },
        uploadUrl: { type: 'string' },
      },
      required: ['image', 'uploadUrl'],
      additionalProperties: false,
    },
  })
}
