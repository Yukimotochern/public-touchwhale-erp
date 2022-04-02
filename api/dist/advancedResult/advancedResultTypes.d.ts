import { JSONSchemaType, AnySchema } from 'ajv';
export interface AdvancedResult<DataType> {
    count: number;
    current_page: number;
    next_page?: number;
    prev_page?: number;
    limit: number;
    result: DataType;
}
export declare function getAdvancedResultSchema<ResultDataType>(resultDataSchema: JSONSchemaType<ResultDataType>): AnySchema;
