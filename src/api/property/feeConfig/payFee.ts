import { request } from 'utils/request/axios'
import { FindPayFeeReply, PayFeeParams } from '../../model/property/feeConfig/payFeeModel'

const ApiPrefix = {
  FindPayFee: '/fee/pay_fee',
  CreatePayFee: '/fee/pay_fee',
  UpdatePayFee: '/fee/pay_fee',
  DeletePayFee: '/fee/pay_fee'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindPayFee = (params: PayFeeParams & PaginationParams) => {
  return request
    .get<FindPayFeeReply>({
      url: ApiPrefix.FindPayFee,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreatePayFee = (data: PayFeeParams) => {
  return request
    .post({
      url: ApiPrefix.CreatePayFee,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdatePayFee = (data: PayFeeParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdatePayFee}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeletePayFee = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeletePayFee}/${ids.join(',')}`
    })
    .then(res => res.data)
}
