import { request } from 'utils/request/axios'
import {
  FindApplyRoomDiscountTypeReply,
  ApplyRoomDiscountTypeParams
} from '../../model/property/feeConfig/applyRoomDiscountTypeModel'

const ApiPrefix = {
  FindApplyRoomDiscountType: '/fee/fee_combo',
  CreateApplyRoomDiscountType: '/fee/fee_combo',
  UpdateApplyRoomDiscountType: '/fee/fee_combo',
  DeleteApplyRoomDiscountType: '/fee/fee_combo'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindApplyRoomDiscountType = (
  params: ApplyRoomDiscountTypeParams & PaginationParams
) => {
  return request
    .get<FindApplyRoomDiscountTypeReply>({
      url: ApiPrefix.FindApplyRoomDiscountType,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateApplyRoomDiscountType = (data: ApplyRoomDiscountTypeParams) => {
  return request
    .post({
      url: ApiPrefix.CreateApplyRoomDiscountType,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateApplyRoomDiscountType = (data: ApplyRoomDiscountTypeParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateApplyRoomDiscountType}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteApplyRoomDiscountType = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteApplyRoomDiscountType}/${ids.join(',')}`
    })
    .then(res => res.data)
}
