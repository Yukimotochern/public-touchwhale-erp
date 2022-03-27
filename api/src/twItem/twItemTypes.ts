import { Types, Document } from 'mongoose'
import { MongooseStatics, MongooseStamps } from '../utils/mongoTypes'

/**
 * * Item
 */
export namespace TwItemType {
  export interface Classifier {
    owner: Types.ObjectId | string
  }

  export interface Editable {
    name: string
    unit: string
    custom_id: string
    count_stock: boolean
    item_type: 'set' | 'element'
    image: string[]
    element: Types.ObjectId | string | TwItemSetDetailType.PlainTwItemSetDetail
  }

  export interface PlainTwItem extends Classifier, Editable {}
}

/**
 * * Item Set
 */
export namespace TwItemSetDetailType {
  export interface Classifier {
    owner: Types.ObjectId | string
  }

  export interface Identity {
    parentItem: Types.ObjectId | string
  }

  export interface Editable {
    elements: SetMembers[]
  }

  export interface SetMembers {
    qty: number
    id: Types.ObjectId | string
  }

  export interface PlainTwItemSetDetail
    extends Classifier,
      Identity,
      Editable {}
}
