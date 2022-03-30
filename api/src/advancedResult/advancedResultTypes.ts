import { JSONSchemaType, AnySchema } from 'ajv'

export interface AdvancedResult<DataType> {
  count: number
  current_page: number
  next_page?: number
  prev_page?: number
  limit: number
  result: DataType
}

export function getAdvancedResultSchema<ResultDataType>(
  resultDataSchema: JSONSchemaType<ResultDataType>
): AnySchema {
  return {
    type: 'object',
    properties: {
      count: {
        type: 'integer',
      },
      current_page: {
        type: 'integer',
      },
      next_page: {
        type: 'integer',
        nullable: true,
      },
      prev_page: {
        type: 'integer',
        nullable: true,
      },
      limit: {
        type: 'integer',
      },
      result: resultDataSchema,
    },
    required: ['count', 'current_page', 'limit'],
    additionalProperties: false,
  }
}
