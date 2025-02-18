import { request } from 'utils/request/axios'
import {
  FindFeeConfigTypeReply,
  FeeConfigTypeParams
} from '../../model/property/feeConfig/feeConfigTypeModel'

const ApiPrefix = {
  FindFeeConfigType: '/fee/fee_config_type',
  CreateFeeConfigType: '/fee/fee_config_type',
  UpdateFeeConfigType: '/fee/fee_config_type',
  DeleteFeeConfigType: '/fee/fee_config_type'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeConfigType = (params: FeeConfigTypeParams & PaginationParams) => {
  return request
    .get<FindFeeConfigTypeReply>({
      url: ApiPrefix.FindFeeConfigType,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeConfigType = (data: FeeConfigTypeParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeConfigType,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeConfigType = (data: FeeConfigTypeParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeConfigType}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeConfigType = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeConfigType}/${ids.join(',')}`
    })
    .then(res => res.data)
}
