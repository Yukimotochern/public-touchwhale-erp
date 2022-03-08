import { Types, Document } from 'mongoose'
import { RequestWithRegularUser } from '../../middlewares/authMiddleware'
import { Request, NextFunction, Response } from 'express'
import { SuccessResponse } from '../types/Response'

// TwItem Model
export interface TwItemType {
  user: Types.ObjectId
  name: string
  unit: string
  custom_id: string
  count_stock: boolean
  item_type: 'set' | 'element'
  image: string
  level: number
}

// TwItemSet Model
export interface TwItemSetDetailType {
  user: Types.ObjectId
  parentItem: Types.ObjectId
  element: Array<Object>
}

export interface ElementObjectType {
  qty: number
  id: string
}

export interface AddItemRequestType extends RequestWithRegularUser {
  name: string
  unit: string
  custom_id: string
  count_stock: boolean
  item_type: 'set' | 'element'
  element: Array<ElementObjectType>
}

export interface AddItemRequestHandler {
  (
    req: RequestWithRegularUser,
    res: SuccessResponse<Object>,
    next: NextFunction
  ): void | Promise<void>
}

// For AJV
export interface TwItemSetType {
  element: Array<object>
}
export interface TwItemEditableType
  extends Omit<TwItemType, 'user' | 'setObject' | 'image' | 'level'> {}
export interface addItemBodyType extends TwItemEditableType {
  element: ElementObjectType[]
}

// For itemOwnerMiddleware res.item
export interface TwItemPayload extends Document {
  name: string
  unit: string
  custom_id: string
  count_stock: boolean
  item_type: 'set' | 'element'
  image: string
  level: number
}

// For itemOwnerMiddleware res.itemElement
export interface TwItemSetPayload extends Document {
  parentItem: Types.ObjectId
  element: Array<object>
}

// For itemOwnerMiddleware res (res.item and res.itemElement)
export interface itemOwnerResponse extends Response {
  item?: TwItemPayload
  itemSetElement?: TwItemSetPayload
}

// For itemOwnerMiddleware function type
export interface itemOwnerResponseHandler {
  (
    req: RequestWithRegularUser,
    res: itemOwnerResponse,
    next: NextFunction
  ): void | Promise<void>
}
