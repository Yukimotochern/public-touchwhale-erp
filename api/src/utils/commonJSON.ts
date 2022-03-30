import { Types } from 'mongoose'
import {
  MongooseStamps,
  MongooseStatics,
  MongooseStampsJSONSchema,
  MongooseStaticsJSONSchema,
} from './mongoTypes'

export interface Owner {
  owner: Types.ObjectId | string
}

export const owner = {
  owner: { type: 'string' },
} as const

export interface Common extends Owner, MongooseStamps, MongooseStatics {}

export const commonSchema = {
  ...MongooseStampsJSONSchema,
  ...MongooseStaticsJSONSchema,
  ...owner,
} as const
