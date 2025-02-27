import { request } from 'utils/request/axios'
import {
  FindPayFeeBatchReply,
  PayFeeBatchParams
} from '../../model/property/feeConfig/payFeeBatchModel'

const ApiPrefix = {
  FindPayFeeBatch: '/fee/pay_fee_batch',
  CreatePayFeeBatch: '/fee/pay_fee_batch',
  UpdatePayFeeBatch: '/fee/pay_fee_batch',
  DeletePayFeeBatch: '/fee/pay_fee_batch'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindPayFeeBatch = (params: PayFeeBatchParams & PaginationParams) => {
  return request
    .get<FindPayFeeBatchReply>({
      url: ApiPrefix.FindPayFeeBatch,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreatePayFeeBatch = (data: PayFeeBatchParams) => {
  return request
    .post({
      url: ApiPrefix.CreatePayFeeBatch,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdatePayFeeBatch = (data: PayFeeBatchParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdatePayFeeBatch}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeletePayFeeBatch = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeletePayFeeBatch}/${ids.join(',')}`
    })
    .then(res => res.data)
}
