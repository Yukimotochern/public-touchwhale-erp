import { AdvancedResult } from './advancedResultTypes'
import { Model, Query, HydratedDocument } from 'mongoose'
import { Request } from 'express'
import CustomError from '../utils/CustomError'
import { start } from 'repl'

/**
 * * Query part of functionality
 * req.query -> query (which can then be manipulate in the controller)
 * * Pagination part of functionality
 * query -> advacedResult ob
 */

export class AdvancedResultApi<ModelDataType> {
  public query: Query<
    HydratedDocument<ModelDataType, {}, {}>[],
    HydratedDocument<ModelDataType, {}, {}>,
    {},
    ModelDataType
  > // * copied from mongoose
  public total_query: Query<
    HydratedDocument<ModelDataType, {}, {}>[],
    HydratedDocument<ModelDataType, {}, {}>,
    {},
    ModelDataType
  > // * copied from mongoose
  public sort: string = '-createdAt'
  public page: number = 1
  public limit: number = 30

  constructor(req: Request, public model: Model<ModelDataType>) {
    if (!req.userJWT) {
      throw new CustomError('User not logged in.')
    }

    // Set owner to query
    const owner = req.userJWT.owner
    req.query.owner = owner

    // Copy req.query
    const normalReqQuery = { ...req.query }

    // Loop over removeFields and delete them from normalReqQuery
    const removeFields = ['sort', 'page', 'limit']
    removeFields.forEach((param) => delete normalReqQuery[param])

    // Create operators ($gt, $gte, etc)
    let queryStr = JSON.stringify(normalReqQuery)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )

    // Set public query
    this.query = model.find(JSON.parse(queryStr))
    this.total_query = model.find(JSON.parse(queryStr))

    // Query that needs special treatment
    let { sort, page, limit } = req.query

    // Sort
    if (sort && typeof sort === 'string') {
      this.sort = sort.split(',').join(' ')
      this.query = this.query.sort(this.sort)
    }

    // Pagination
    if (page && typeof page === 'string') {
      this.page = Math.max(parseInt(page, 10), 1)
    }

    if (limit && typeof limit === 'string') {
      this.limit = Math.max(parseInt(limit, 10), 1)
    }
    const startIndex = (this.page - 1) * this.limit
    this.query = this.query.skip(startIndex).limit(this.limit)
  }

  async result<ResultDataType>(
    result: HydratedDocument<ResultDataType, {}, {}>[]
  ): Promise<AdvancedResult<HydratedDocument<ResultDataType, {}, {}>[]>> {
    const startIndex = (this.page - 1) * this.limit
    const endIndex = this.page * this.limit
    const total = await this.model.countDocuments(this.total_query)
    const advacedResult: AdvancedResult<
      HydratedDocument<ResultDataType, {}, {}>[]
    > = {
      result: result,
      current_page: this.page,
      limit: this.limit,
      count: total,
    }
    if (endIndex < total) {
      advacedResult.next_page = this.page + 1
    }
    if (startIndex > 0) {
      advacedResult.prev_page = this.page - 1
    }
    return advacedResult
  }
}
