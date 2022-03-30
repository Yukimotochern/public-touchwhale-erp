// Models
import { TwItem } from './twItemModel'
import { TwItemSetDetail } from './twItemModel'

// advanced result
import { AdvancedResultApi } from 'api/dist/advancedResult/advancedResultApi'

// Utils modules
import { uploadImage, deleteImage } from '../../utils/AWS/b2'
import CustomError from '../../utils/CustomError'
import { v4 as uuid } from 'uuid'

// Type definition
import { TwItemSetDetailType, TwItemType } from 'api/dist/twItem/twItemTypes'
import { RequestHandler } from 'express'
import { Types as MongooseTypes } from 'mongoose'

import {
  CreateItem,
  UpdateItem,
  GetItem,
  GetItemsWithDetail,
  GetItems,
  GetImageUploadUrl,
} from 'api/dist/twItem/twItemApi'
import { avjErrorWrapper } from 'api/dist/utils/ajv'
import { api } from 'api/dist/api'

const ItemImageKeyPrifix = 'TwItemImage'

const API = new api()

/**
 * @route  GET api/v1/twItem/withDetail
 * @desc   Get all items with specific owner, populate the virtual detail
 * @access Private
 */
export const getItemsWithDetail: RequestHandler = async (req, res, next) => {
  const advancedQuery = new AdvancedResultApi<TwItemType.TwItem>(req, TwItem)
  const twItemWithDetail = await advancedQuery.query.populate<
    Pick<TwItemType.TwItemWithSetDetail, 'set_detail'>
  >('set_detail')
  const result = await advancedQuery.result(twItemWithDetail)
  return GetItemsWithDetail.API.sendData(res, result)
}

/**
 * @route  GET api/v1/twItem
 * @desc   Get all items with specific owner
 * @access Private
 */
export const getItems: RequestHandler = async (req, res, next) => {
  const advancedQuery = new AdvancedResultApi<TwItemType.TwItem>(req, TwItem)
  const twItem = await advancedQuery.query
  const result = await advancedQuery.result(twItem)
  return GetItems.API.sendData(res, result)
}

/**
 * @route    POST api/v1/twItem/
 * @desc     Create a TwItem
 * @access   Private
 */
export const createItem: RequestHandler = async (req, res, next) => {
  if (CreateItem.API.bodyValidator(req.body) && req.userJWT) {
    const { twItem, members } = req.body
    const { name, item_type } = twItem
    const item_for_owner = await TwItem.findOne({
      owner: req.userJWT.owner,
      name: name && name.trim(),
    })
    if (item_for_owner) {
      return next(
        new CustomError(`You have a item with same name: '${name}' `, 409)
      )
    }
    if (item_type === 'element' && members) {
      return next(new CustomError('You can not set element into single item.'))
    }
    if (item_type === 'set' && !members) {
      return next(
        new CustomError('You must provide set details for item of type set.')
      )
    }

    const item = new TwItem({
      owner: req.userJWT.owner,
      ...twItem,
    })
    await item.save()

    if (item_type === 'set') {
      const set = new TwItemSetDetail({
        owner: req.userJWT.id,
        parentItem: item._id,
        members,
      })
      await set.save()
    }
    const populatedItem = await item.populate<
      Pick<TwItemType.TwItemWithSetDetail, 'set_detail'>
    >('set_detail')
    return CreateItem.API.sendData(res, populatedItem)
  } else {
    return next(avjErrorWrapper(CreateItem.API.bodyValidator.errors))
  }
}

/**
 * @route    GET api/v1/twItem/:id
 * @desc     Get single item by id, with member populated
 * @access   Private
 */
export const getItem: RequestHandler = async (req, res, next) => {
  if (req.userJWT) {
    let item = await TwItem.findOne({
      owner: req.userJWT.owner,
      _id: req.params.id,
    })
    if (!item) {
      return next(new CustomError('Item not found.', 404))
    }
    const populateItem = await item.populate<
      Pick<TwItemType.TwItemWithSetDetail, 'set_detail'>
    >('set_detail')
    return GetItem.API.sendData(res, populateItem)
  }
  return next(new CustomError('This route should be private.'))
}

/**
 * @route    GET api/v1/twItem/uploadImage/:id
 * @desc     Get B2 url for frontend to make a put request
 * @access   Private
 */
export const getB2URL: RequestHandler = async (req, res, next) => {
  if (req.userJWT) {
    const itemId = req.params.id
    const item = await TwItem.findOne({
      owner: req.userJWT?.owner,
      _id: req.params.id,
    })
    if (!item) {
      return next(new CustomError('Item not found.', 404))
    }
    const { Key, url } = await uploadImage(
      ItemImageKeyPrifix,
      `${itemId}/${uuid()}`
    )
    let image = `https://tw-user-data.s3.us-west-000.backblazeb2.com/${Key}`
    GetImageUploadUrl.API.sendData(res, { uploadUrl: url, image })
  }
  return next(new CustomError('This route should be private.'))
}

/**
 *  @route    DELETE api/v1/twItem/uploadImage/:key
 *  @desc     Delete image
 *  @access   Private
 */
export const deleteItemImage: RequestHandler = async (req, res, next) => {
  await deleteImage(ItemImageKeyPrifix, req.params.key)
  return API.send(res, 200, { message: 'Image deleted.' })
}

/**
 * @route    PUT api/v1/twItem/:id
 * @desc     Update item by id
 * @access   Private
 */
export const updateItem: RequestHandler = async (req, res, next) => {
  if (!req.userJWT?.id) {
    return next(new CustomError('Invalid credentials.', 401))
  }
  if (UpdateItem.API.bodyValidator(req.body)) {
    let item = await TwItem.findOne({
      owner: req.userJWT.owner,
      _id: req.params.id,
    })

    if (!item) {
      return next(new CustomError('Item not found.', 404))
    }
    let populatedItem = await item.populate<
      Pick<TwItemType.TwItemWithSetDetail, 'set_detail'>
    >('set_detail')
    // User want to change these fields
    const { twItem, members } = req.body

    // checks first
    if (twItem) {
      const { name, item_type } = twItem
      if (name) {
        const item_with_same_name_and_owner = await TwItem.findOne({
          user: req.userJWT.owner,
          name: name.trim(),
        })
        if (
          item_with_same_name_and_owner &&
          String(item_with_same_name_and_owner._id) !== req.params.id
        ) {
          return next(
            new CustomError(
              `You have another item with same name: '${name}' `,
              409
            )
          )
        }
      }
      if (item_type) {
        populatedItem.item_type = item_type
      }
    }
    if (members) {
      if (populatedItem.item_type === 'element') {
        return next(
          new CustomError(
            'You cannot set members for item with element type.',
            422
          )
        )
      }
      if (
        !(await check_no_loop(
          members,
          populatedItem._id,
          String(req.userJWT.owner)
        ))
      ) {
        return next(
          new CustomError('The updates to the member field will incur a loop.')
        )
      }
    } else {
      if (populatedItem.item_type === 'set' && !populatedItem.set_detail) {
        return next(
          new CustomError('You must set members for item of set type', 422)
        )
      }
    }

    if (twItem) {
      /**
       * ! noticed that the populatedItem will the be newer version and still populated
       * ! after the below command but the populated data may not the be new version.
       */
      await populatedItem.updateOne(twItem, {
        runValidators: true,
        returnDocument: 'after',
      })
    }

    if (members) {
      await TwItemSetDetail.findOneAndUpdate(
        { owner: req.userJWT.owner, parentItem: populatedItem._id },
        { $set: { members } },
        { upsert: true, runValidators: true }
      )
    } else if (
      populatedItem.item_type === 'element' &&
      populatedItem.set_detail
    ) {
      await TwItemSetDetail.deleteMany({
        owner: req.userJWT.owner,
        parentItem: item._id,
      })
    }

    // things are updated, query again
    let new_item = await TwItem.findOne({
      owner: req.userJWT.owner,
      _id: req.params.id,
    })

    if (!new_item) {
      return next(new CustomError('Item not found.', 404))
    }
    let newPopulatedItem = await new_item.populate<
      Pick<TwItemType.TwItemWithSetDetail, 'set_detail'>
    >('set_detail')

    return UpdateItem.API.sendData(res, newPopulatedItem)
  } else {
    return next(avjErrorWrapper(UpdateItem.API.bodyValidator.errors))
  }
}

/**
 * @route    DELETE api/v1/twItem/:id
 * @desc     Update item by id
 * @access   Private
 */
export const deleteItem: RequestHandler = async (req, res, next) => {
  const item = await TwItem.findOne({
    owner: req.userJWT?.owner,
    _id: req.params.id,
  })
  if (!item) {
    return next(new CustomError('Item not found.', 404))
  }
  await item.delete()

  return API.send(res, 200, { message: 'Item deleted.' })
}

const check_no_loop = async (
  members: TwItemSetDetailType.SetMember[],
  item_id_get: string | MongooseTypes.ObjectId,
  owner: string
) => {
  let item_id = String(item_id_get)
  let membersIdArray = members.map((mem) => String(mem.member_id))
  let searched: string[] = []
  while (membersIdArray.length) {
    const new_member = membersIdArray.pop() // pop is easier to do
    if (!new_member) break
    if (!searched.includes(new_member)) {
      if (new_member === item_id) {
        return false
      } else {
        const new_child = await TwItemSetDetail.findOne({
          owner,
          parentItem: new_member,
        })
        if (new_child) {
          membersIdArray = membersIdArray.concat(
            new_child.members.map((mem) => String(mem.member_id))
          )
        }
        searched.push(new_member)
      }
    }
  }
  return true
}
