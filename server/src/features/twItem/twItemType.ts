import { Types, Document } from 'mongoose'
import { MongooseStatics } from '../../utils/mongodb'
import { Request, NextFunction, Response } from 'express'
import { ApiRes } from '../apiTypes'

//////////////// Item ////////////////
export namespace ItemType {
	export interface Classifier {
		owner: Types.ObjectId | string
	}

	export interface ItemContent {
		name: string
		unit: string
		custom_id: string
		count_stock: boolean
		item_type: 'set' | 'element'
		image: string
	}

	export interface Stamp {
		createdAt: Date | string
		updatedAt: Date | string
	}

	export interface TwItemType extends Classifier, ItemContent {
		element: ItemSetDetailType.ElementObjectType[]
	}

	export interface Mongoose extends TwItemType, Stamp, MongooseStatics {}

	export interface PlainItem extends TwItemType, MongooseStatics {
		element: ItemSetDetailType.ElementObjectType[]
	}

	// For AJV
	export interface TwItemSetType {
		element: Array<object>
	}
	export interface TwItemEditableType
		extends Omit<TwItemType, 'owner' | 'setObject' | 'image'> {}
	export interface addItemBodyType extends TwItemEditableType {}

	export namespace AddItem {
		export interface Body extends addItemBodyType {}
		export interface Data extends PlainItem {}
	}

	export namespace UpdateItem {
		export interface Body extends addItemBodyType {}
		export interface Data extends PlainItem {}
	}

	export namespace GetItem {
		export interface Data extends PlainItem {}
	}

	export namespace GetImageUploadUrl {
		export interface Data extends Required<Pick<ItemContent, 'image'>> {
			uploadUrl: string
		}
	}
}

//////////////// ItemSetDetail ////////////////
export namespace ItemSetDetailType {
	// TwItemSet Model
	export interface TwItemSetDetailType {
		owner: Types.ObjectId | string
		parentItem: Types.ObjectId | string
		element: Array<ElementObjectType>
	}

	export interface ElementObjectType {
		qty: number
		id: string
	}

	// For itemOwnerMiddleware res.itemElement
	export interface TwItemSetPayload extends Document {
		parentItem: Types.ObjectId | string
		element: Array<ElementObjectType>
	}
}

// export interface AddItemRequestType extends Request {
// 	name: string
// 	unit: string
// 	custom_id: string
// 	count_stock: boolean
// 	item_type: 'set' | 'element'
// 	element: Array<ElementObjectType>
// }

declare global {
	namespace Express {
		interface Request {}
		interface Response {}
		interface Application {}
	}
}
