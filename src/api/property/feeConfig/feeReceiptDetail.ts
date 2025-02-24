import { request } from 'utils/request/axios'
import {
  FindFeeReceiptDetailReply,
  FeeReceiptDetailParams
} from '../../model/property/feeConfig/feeReceiptDetailModel'

const ApiPrefix = {
  FindFeeReceiptDetail: '/fee/fee_receipt_detail',
  CreateFeeReceiptDetail: '/fee/fee_receipt_detail',
  UpdateFeeReceiptDetail: '/fee/fee_receipt_detail',
  DeleteFeeReceiptDetail: '/fee/fee_receipt_detail'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeReceiptDetail = (params: FeeReceiptDetailParams & PaginationParams) => {
  return request
    .get<FindFeeReceiptDetailReply>({
      url: ApiPrefix.FindFeeReceiptDetail,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeReceiptDetail = (data: FeeReceiptDetailParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeReceiptDetail,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeReceiptDetail = (data: FeeReceiptDetailParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeReceiptDetail}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeReceiptDetail = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeReceiptDetail}/${ids.join(',')}`
    })
    .then(res => res.data)
}
