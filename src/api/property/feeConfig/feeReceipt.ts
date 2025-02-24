import { request } from 'utils/request/axios'
import {
  FindFeeReceiptReply,
  FeeReceiptParams
} from '../../model/property/feeConfig/feeReceiptModel'

const ApiPrefix = {
  FindFeeReceipt: '/fee/fee_receipt',
  CreateFeeReceipt: '/fee/fee_receipt',
  UpdateFeeReceipt: '/fee/fee_receipt',
  DeleteFeeReceipt: '/fee/fee_receipt'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeReceipt = (params: FeeReceiptParams & PaginationParams) => {
  return request
    .get<FindFeeReceiptReply>({
      url: ApiPrefix.FindFeeReceipt,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeReceipt = (data: FeeReceiptParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeReceipt,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeReceipt = (data: FeeReceiptParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeReceipt}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeReceipt = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeReceipt}/${ids.join(',')}`
    })
    .then(res => res.data)
}
