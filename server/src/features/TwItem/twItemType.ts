import { Types, Document } from 'mongoose'
import { Request, NextFunction, Response } from 'express'
import { ApiRes } from '../apiTypes'

// TwItem Model
export interface TwItemType {
  owner: Types.ObjectId | string
  name: string
  unit: string
  custom_id: string
  count_stock: boolean
  item_type: 'set' | 'element'
  image: string
}

// TwItemSet Model
export interface TwItemSetDetailType {
  owner: Types.ObjectId | string
  parentItem: Types.ObjectId
  element: Array<ElementObjectType>
}

export interface ElementObjectType {
  qty: number
  id: string
}

export interface AddItemRequestType extends Request {
  name: string
  unit: string
  custom_id: string
  count_stock: boolean
  item_type: 'set' | 'element'
  element: Array<ElementObjectType>
}

declare global {
  namespace Express {
    interface Request {}
    interface Response {}
    interface Application {}
  }
}

export interface AddItemRequestHandler {
  (req: Request, res: ApiRes<Object>, next: NextFunction): void | Promise<void>
}

// For AJV
export interface TwItemSetType {
  element: Array<object>
}
export interface TwItemEditableType
  extends Omit<TwItemType, 'owner' | 'setObject' | 'image'> {}
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
}

// For itemOwnerMiddleware res.itemElement
export interface TwItemSetPayload extends Document {
  parentItem: Types.ObjectId
  element: Array<ElementObjectType>
}

// For itemOwnerMiddleware res (res.item and res.itemElement)
export interface itemOwnerResponse extends Response {
  item?: TwItemPayload
  itemSetElement?: TwItemSetPayload
}

// For itemOwnerMiddleware function type
export interface itemOwnerResponseHandler {
  (
    req: Request,
    res: itemOwnerResponse,
    next: NextFunction
  ): void | Promise<void>
}
