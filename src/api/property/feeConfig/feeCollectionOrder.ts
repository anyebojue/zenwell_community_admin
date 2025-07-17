import { request } from 'utils/request/axios'
import {
  FindFeeCollectionOrderReply,
  FeeCollectionOrderParams
} from '../../model/property/feeConfig/feeCollectionOrderModel'

const ApiPrefix = {
  FindFeeCollectionOrder: '/fee/fee_collection_order',
  CreateFeeCollectionOrder: '/fee/fee_collection_order',
  UpdateFeeCollectionOrder: '/fee/fee_collection_order',
  DeleteFeeCollectionOrder: '/fee/fee_collection_order'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeCollectionOrder = (params: FeeCollectionOrderParams & PaginationParams) => {
  return request
    .get<FindFeeCollectionOrderReply>({
      url: ApiPrefix.FindFeeCollectionOrder,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeCollectionOrder = (data: FeeCollectionOrderParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeCollectionOrder,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeCollectionOrder = (data: FeeCollectionOrderParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeCollectionOrder}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeCollectionOrder = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeCollectionOrder}/${ids.join(',')}`
    })
    .then(res => res.data)
}
