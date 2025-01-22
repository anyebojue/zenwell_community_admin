import { request } from 'utils/request/axios'
import {
  FindSpaceConfirmOrderReply,
  SpaceConfirmOrderParams
} from '../model/property/spaceConfirmOrderModel'

const ApiPrefix = {
  FindSpaceConfirmOrder: '/auth/space_confirm_order',
  CreateSpaceConfirmOrder: '/auth/space_confirm_order',
  UpdateSpaceConfirmOrder: '/auth/space_confirm_order',
  DeleteSpaceConfirmOrder: '/auth/space_confirm_order'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindSpaceConfirmOrder = (params: SpaceConfirmOrderParams & PaginationParams) => {
  return request
    .get<FindSpaceConfirmOrderReply>({
      url: ApiPrefix.FindSpaceConfirmOrder,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateSpaceConfirmOrder = (data: SpaceConfirmOrderParams) => {
  return request
    .post({
      url: ApiPrefix.CreateSpaceConfirmOrder,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateSpaceConfirmOrder = (data: SpaceConfirmOrderParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateSpaceConfirmOrder}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteSpaceConfirmOrder = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteSpaceConfirmOrder}/${ids.join(',')}`
    })
    .then(res => res.data)
}
