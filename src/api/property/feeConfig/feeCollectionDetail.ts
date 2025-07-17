import { request } from 'utils/request/axios'
import {
  FindFeeCollectionDetailReply,
  FeeCollectionDetailParams
} from '../../model/property/feeConfig/feeCollectionDetailModel'

const ApiPrefix = {
  FindFeeCollectionDetail: '/fee/fee_collection_detail',
  CreateFeeCollectionDetail: '/fee/fee_collection_detail',
  UpdateFeeCollectionDetail: '/fee/fee_collection_detail',
  DeleteFeeCollectionDetail: '/fee/fee_collection_detail'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeCollectionDetail = (params: FeeCollectionDetailParams & PaginationParams) => {
  return request
    .get<FindFeeCollectionDetailReply>({
      url: ApiPrefix.FindFeeCollectionDetail,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeCollectionDetail = (data: FeeCollectionDetailParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeCollectionDetail,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeCollectionDetail = (data: FeeCollectionDetailParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeCollectionDetail}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeCollectionDetail = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeCollectionDetail}/${ids.join(',')}`
    })
    .then(res => res.data)
}
