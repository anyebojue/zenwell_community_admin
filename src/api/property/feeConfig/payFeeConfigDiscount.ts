import { request } from 'utils/request/axios'
import {
  FindPayFeeConfigDiscountReply,
  PayFeeConfigDiscountParams
} from '../../model/property/feeConfig/payFeeConfigDiscountModel'

const ApiPrefix = {
  FindPayFeeConfigDiscount: '/fee/pay_fee_config_discount',
  CreatePayFeeConfigDiscount: '/fee/pay_fee_config_discount',
  UpdatePayFeeConfigDiscount: '/fee/pay_fee_config_discount',
  DeletePayFeeConfigDiscount: '/fee/pay_fee_config_discount'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindPayFeeConfigDiscount = (params: PayFeeConfigDiscountParams & PaginationParams) => {
  return request
    .get<FindPayFeeConfigDiscountReply>({
      url: ApiPrefix.FindPayFeeConfigDiscount,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreatePayFeeConfigDiscount = (data: PayFeeConfigDiscountParams) => {
  return request
    .post({
      url: ApiPrefix.CreatePayFeeConfigDiscount,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdatePayFeeConfigDiscount = (data: PayFeeConfigDiscountParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdatePayFeeConfigDiscount}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeletePayFeeConfigDiscount = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeletePayFeeConfigDiscount}/${ids.join(',')}`
    })
    .then(res => res.data)
}
