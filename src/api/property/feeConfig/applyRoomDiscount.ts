import { request } from 'utils/request/axios'
import {
  FindApplyRoomDiscountReply,
  ApplyRoomDiscountParams
} from '../../model/property/feeConfig/applyRoomDiscountModel'

const ApiPrefix = {
  FindApplyRoomDiscount: '/fee/apply_room_discount',
  CreateApplyRoomDiscount: '/fee/apply_room_discount',
  UpdateApplyRoomDiscount: '/fee/apply_room_discount',
  DeleteApplyRoomDiscount: '/fee/apply_room_discount'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindApplyRoomDiscount = (params: ApplyRoomDiscountParams & PaginationParams) => {
  return request
    .get<FindApplyRoomDiscountReply>({
      url: ApiPrefix.FindApplyRoomDiscount,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateApplyRoomDiscount = (data: ApplyRoomDiscountParams) => {
  return request
    .post({
      url: ApiPrefix.CreateApplyRoomDiscount,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateApplyRoomDiscount = (data: ApplyRoomDiscountParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateApplyRoomDiscount}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteApplyRoomDiscount = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteApplyRoomDiscount}/${ids.join(',')}`
    })
    .then(res => res.data)
}
