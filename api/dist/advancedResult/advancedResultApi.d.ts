import { AdvancedResult } from './advancedResultTypes';
import { Model, Query, HydratedDocument } from 'mongoose';
import { Request } from 'express';
/**
 * * Query part of functionality
 * req.query -> query (which can then be manipulate in the controller)
 * * Pagination part of functionality
 * query -> advacedResult ob
 */
export declare class AdvancedResultApi<ModelDataType> {
    model: Model<ModelDataType>;
    query: Query<HydratedDocument<ModelDataType, {}, {}>[], HydratedDocument<ModelDataType, {}, {}>, {}, ModelDataType>;
    total_query: Query<HydratedDocument<ModelDataType, {}, {}>[], HydratedDocument<ModelDataType, {}, {}>, {}, ModelDataType>;
    sort: string;
    page: number;
    limit: number;
    constructor(req: Request, model: Model<ModelDataType>);
    result<ResultDataType>(result: HydratedDocument<ResultDataType, {}, {}>[]): Promise<AdvancedResult<HydratedDocument<ResultDataType, {}, {}>[]>>;
}
