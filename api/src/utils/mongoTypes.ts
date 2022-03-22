// Interface
export interface MongooseStamps {
  createdAt: Date | string
  updatedAt: Date | string
}

export interface MongooseStatics {
  _id: string
  __v: number
}

// Schema
export const MongooseStampsJSONSchema = {
  createdAt: {
    anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
  },
  updatedAt: {
    anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
  },
} as const

export const MongooseStaticsJSONSchema = {
  _id: { type: 'string' },
  __v: { type: 'number' },
} as const
