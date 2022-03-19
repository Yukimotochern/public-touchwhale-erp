// Models
import { TwItem } from './twItemModel'
import { TwItemSetDetail } from './twItemModel'

// Middlewares
import { advancedResultResponse } from '../../middlewares/advancedResult'
import { RequestHandler } from 'express'

// Utils modules
import { uploadImage } from '../../utils/AWS/b2'
import CustomError from '../../utils/CustomError'

// Type definition
import { ItemSetDetailType } from './twItemType'

import { ItemIO } from './twItemHandlerIO'
import { HandlerIO } from '../apiIO'
import { avjErrorWrapper } from '../../utils/ajv'

const { AddItem, UpdateItem, GetItem, GetImageUploadUrl } = ItemIO

const ItemImageKeyPrifix = 'TwItemImage'

// @route    GET api/v1/twItem/
// @desc     Get all items with specific user
// @access   Private
export const getItems: RequestHandler = async (
  req,
  res: advancedResultResponse,
  next
) => {
  res.status(200).json(res.advancedResults)
}

// @route    POST api/v1/twItem/
// @desc     Add a item and ref to user
// @access   Private
export const addItem: RequestHandler = async (req, res, next) => {
  if (AddItem.bodyValidator(req.body) && req.userJWT?.id) {
    const { name, unit, custom_id, count_stock, item_type, element } = req.body
    const item_for_user = await TwItem.findOne({
      user: req.userJWT.id,
      name: name.trim(),
    })
    if (item_for_user) {
      return next(
        new CustomError(`You have a item with same name: \'${name}\' `)
      )
    }
    if (item_type === 'element' && element) {
      return next(new CustomError('You can not set element into single item.'))
    }

    const item = new TwItem({
      owner: req.userJWT.id,
      name,
      unit,
      custom_id,
      count_stock,
      item_type,
    })
    await item.save()

    if (item_type === 'set') {
      await item.save()

      const set = new TwItemSetDetail({
        user: req.userJWT.id,
        parentItem: item._id,
        element,
      })
      await set.save()
    }

    return AddItem.sendData(res, item)
  } else {
    return next(avjErrorWrapper(AddItem.bodyValidator.errors))
  }
}

// "element": [{"qty": 2, "id": "62241c8f7096ddea6783e41a"}, {"qty": 3, "id": "622392fbafbb949826bd2a07"}]

// @route    GET api/v1/twItem/:id
// @desc     Get single item by item's id
// @access   Private
export const getItem: RequestHandler = async (req, res, next) => {
  const populate = req.query.populate
  let query = TwItem.findOne({
    owner: req.userJWT?.owner,
    _id: req.params.id,
  })
  if (populate) {
    query = query.populate('setOfElement', 'element')
  }
  const item = await query

  if (!item) {
    return next(new CustomError('Item not found.', 404))
  }
  GetItem.sendData(res, item)
}

// @route    GET api/v1/twItem/uploadAvatar/:id
// @desc     Get B2 url for frontend to make a put request
// @access   Private
export const getB2URL: RequestHandler = async (req, res, next) => {
  const itemId = req.params.id
  const item = await TwItem.findOne({
    owner: req.userJWT?.owner,
    _id: req.params.id,
  })
  if (!item) {
    return next(new CustomError('Item not found.', 404))
  }
  const { Key, url } = await uploadImage(ItemImageKeyPrifix, itemId)
  let image = `https://tw-user-data.s3.us-west-000.backblazeb2.com/${Key}`
  item.image = image
  await item.save()
  // res.status(200).send({ msg: result })
  GetImageUploadUrl.sendData(res, { uploadUrl: url, image })
}

// @route    PUT api/v1/twItem/:id
// @desc     Update item by item's id
// @access   Private
export const updateItem: RequestHandler = async (req, res, next) => {
  if (!req.userJWT?.id) {
    return next(new CustomError('Invalid credentials.', 401))
  }
  if (UpdateItem.bodyValidator(req.body)) {
    let item = await TwItem.findOne({
      owner: req.userJWT?.owner,
      _id: req.params.id,
    })

    if (!item) {
      return next(new CustomError('Item not found.', 404))
    }
    // User want to change these fields
    const { name, unit, custom_id, count_stock, item_type, element } = req.body

    // Find if user has a item's name that same with req.body
    const item_for_user = await TwItem.findOne({
      user: req.userJWT.id,
      name: name.trim(),
    })

    // Check if that item not equal with item(/:id)
    if (
      item_for_user?.custom_id &&
      item_for_user?.custom_id !== item.custom_id
    ) {
      return next(
        new CustomError(`You have a item with same name: \'${name}\' `)
      )
    }

    if (item_type === 'element' && element) {
      return next(new CustomError('You can not set element into single intem.'))
    }

    item.name = name ? name : item.name
    item.unit = unit ? unit : item.unit
    item.custom_id = custom_id ? custom_id : item.custom_id
    item.count_stock = count_stock ? count_stock : item.count_stock
    item.item_type = item_type ? item_type : item.item_type
    console.log(element)

    try {
      if (element) {
        if (await check_no_loop(element, item.id)) {
          let itemSetElement = await TwItemSetDetail.findOne({
            owner: req.userJWT.owner,
            parentItem: item.id,
          })
          if (itemSetElement) {
            itemSetElement.element = element
            await itemSetElement.save()
          } else {
            const set = new TwItemSetDetail({
              owner: req.userJWT.id,
              parentItem: item._id,
              element,
            })

            await set.save()
          }
        } else {
          return next(new CustomError('Items element has a loop. '))
        }
      }
      await item.save()
      // res.status(200).json({ data: item })
      UpdateItem.sendData(res, item)
    } catch (err) {
      return next(
        new CustomError(
          'Something wrong. Maybe there has duplicate field in your items',
          401,
          err
        )
      )
    }
  } else {
    return next(avjErrorWrapper(UpdateItem.bodyValidator.errors))
  }
}

// @route    DELETE api/v1/twItem/:id
// @desc     Update item by item's id
// @access   Private
export const deleteItem: RequestHandler = async (req, res, next) => {
  const item = await TwItem.findOne({
    owner: req.userJWT?.owner,
    _id: req.params.id,
  })
  if (!item) {
    return next(new CustomError('Item not found.', 404))
  }
  item.delete()

  return HandlerIO.send(res, 200, { message: 'Item deleted.' })
}

// Helper function
// find max level element and return max level
// const max_level = async (element: ElementObjectType[]) => {
//   // push all element's id in array
//   const elementId_array = new Array()
//   element.map((ele) => {
//     elementId_array.push(ele.id)
//   })

//   // find all document in element array
//   const all_element = await TwItem.find().where('_id').in(elementId_array)

//   // find max level document
//   let max_level_element = all_element.reduce(function (pre, cur) {
//     return pre.level > cur.level ? pre : cur
//   })

//   return max_level_element.level + 1
// }

const check_no_loop = async (
  element: ItemSetDetailType.ElementObjectType[],
  item_id: string
) => {
  let elementId_array = new Array()
  element.map((ele) => {
    elementId_array.push(ele.id)
  })
  let searched = new Array()

  while (elementId_array.length) {
    const new_element = elementId_array.shift()

    if (!searched.includes(new_element)) {
      if (new_element === item_id) {
        return false
      } else {
        const new_child = await TwItemSetDetail.findOne({
          parentItem: new_element,
        })

        const new_array = new Array()
        new_child?.element.map((obj) => {
          new_array.push(obj.id)
        })
        elementId_array = elementId_array.concat(new_array)
        searched.push(new_element)
      }
    }
  }
  return true
}
