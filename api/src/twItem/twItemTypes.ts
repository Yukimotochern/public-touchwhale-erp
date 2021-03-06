import { Types } from 'mongoose'
import { Common } from '../utils/commonJSON'

/**
 * * Item
 */
export namespace TwItemType {
  export interface Editable {
    name?: string
    unit?: string
    custom_id?: string
    count_stock: boolean
    item_type: 'set' | 'element'
    image: string[]
  }

  export interface TwItem extends Editable, Common {}

  export interface TwItemWithSetDetail extends Editable, Common {
    set_detail: TwItemSetDetailType.TwItemSetDetail | null
  }
  export interface TwItemWithSetDetailPopulated extends Editable, Common {
    set_detail: TwItemSetDetailType.PopulatedTwItemSetDetail | null
  }
}

/**
 * * Item Set
 */
export namespace TwItemSetDetailType {
  export interface Identity {
    parentItem: Types.ObjectId | string
  }

  export interface Editable {
    members: SetMember[]
  }

  export interface PopulatedMembers {
    members: PopulatedSetMember[]
  }

  export interface SetMember {
    qty: number
    member: Types.ObjectId | string
  }

  export interface PopulatedSetMember {
    qty: number
    member: TwItemType.TwItem
  }

  export interface TwItemSetDetail extends Common, Identity, Editable {}

  export interface PopulatedTwItemSetDetail
    extends Common,
      Identity,
      PopulatedMembers {}
}
