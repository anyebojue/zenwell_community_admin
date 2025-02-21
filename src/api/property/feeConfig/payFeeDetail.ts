import { request } from 'utils/request/axios'
import {
  FindPayFeeDetailReply,
  PayFeeDetailParams
} from '../../model/property/feeConfig/payFeeDetailModel'

const ApiPrefix = {
  FindPayFeeDetail: '/fee/return_pay_fee',
  CreatePayFeeDetail: '/fee/return_pay_fee',
  UpdatePayFeeDetail: '/fee/return_pay_fee',
  DeletePayFeeDetail: '/fee/return_pay_fee'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindPayFeeDetail = (params: PayFeeDetailParams & PaginationParams) => {
  return request
    .get<FindPayFeeDetailReply>({
      url: ApiPrefix.FindPayFeeDetail,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreatePayFeeDetail = (data: PayFeeDetailParams) => {
  return request
    .post({
      url: ApiPrefix.CreatePayFeeDetail,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdatePayFeeDetail = (data: PayFeeDetailParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdatePayFeeDetail}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeletePayFeeDetail = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeletePayFeeDetail}/${ids.join(',')}`
    })
    .then(res => res.data)
}
