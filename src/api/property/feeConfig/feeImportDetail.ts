import { request } from 'utils/request/axios'
import {
  FindFeeImportDetailReply,
  FeeImportDetailParams
} from '../../model/property/feeConfig/feeImportDetailModel'

const ApiPrefix = {
  FindFeeImportDetail: '/fee/fee_import_detail',
  CreateFeeImportDetail: '/fee/fee_import_detail',
  UpdateFeeImportDetail: '/fee/fee_import_detail',
  DeleteFeeImportDetail: '/fee/fee_import_detail'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeImportDetail = (params: FeeImportDetailParams & PaginationParams) => {
  return request
    .get<FindFeeImportDetailReply>({
      url: ApiPrefix.FindFeeImportDetail,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeImportDetail = (data: FeeImportDetailParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeImportDetail,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeImportDetail = (data: FeeImportDetailParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeImportDetail}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeImportDetail = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeImportDetail}/${ids.join(',')}`
    })
    .then(res => res.data)
}
