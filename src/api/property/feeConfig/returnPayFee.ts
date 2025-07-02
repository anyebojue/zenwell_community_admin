import { request } from 'utils/request/axios'
import {
  FindReturnPayFeeReply,
  ReturnPayFeeParams
} from '../../model/property/feeConfig/returnPayFeeModel'

const ApiPrefix = {
  FindReturnPayFee: '/fee/return_pay_fee',
  CreateReturnPayFee: '/fee/return_pay_fee',
  UpdateReturnPayFee: '/fee/return_pay_fee',
  DeleteReturnPayFee: '/fee/return_pay_fee'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindReturnPayFee = (
  params: ReturnPayFeeParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindReturnPayFeeReply>({
      url: ApiPrefix.FindReturnPayFee,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateReturnPayFee = (data: ReturnPayFeeParams) => {
  return request
    .post({
      url: ApiPrefix.CreateReturnPayFee,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateReturnPayFee = (data: ReturnPayFeeParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateReturnPayFee}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteReturnPayFee = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteReturnPayFee}/${ids.join(',')}`
    })
    .then(res => res.data)
}
