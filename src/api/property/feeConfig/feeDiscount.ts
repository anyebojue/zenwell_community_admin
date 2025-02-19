import { request } from 'utils/request/axios'
import {
  FindFeeDiscountReply,
  FeeDiscountParams
} from '../../model/property/feeConfig/feeDiscountModel'

const ApiPrefix = {
  FindFeeDiscount: '/fee/fee_discount',
  CreateFeeDiscount: '/fee/fee_discount',
  UpdateFeeDiscount: '/fee/fee_discount',
  DeleteFeeDiscount: '/fee/fee_discount'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeDiscount = (params: FeeDiscountParams & PaginationParams) => {
  return request
    .get<FindFeeDiscountReply>({
      url: ApiPrefix.FindFeeDiscount,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeDiscount = (data: FeeDiscountParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeDiscount,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeDiscount = (data: FeeDiscountParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeDiscount}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeDiscount = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeDiscount}/${ids.join(',')}`
    })
    .then(res => res.data)
}
