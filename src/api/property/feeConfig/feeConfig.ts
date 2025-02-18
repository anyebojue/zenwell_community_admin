import { request } from 'utils/request/axios'
import { FindFeeConfigReply, FeeConfigParams } from '../../model/property/feeConfig/feeConfigModel'

const ApiPrefix = {
  FindFeeConfig: '/fee/fee_config',
  CreateFeeConfig: '/fee/fee_config',
  UpdateFeeConfig: '/fee/fee_config',
  DeleteFeeConfig: '/fee/fee_config'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeConfig = (params: FeeConfigParams & PaginationParams) => {
  return request
    .get<FindFeeConfigReply>({
      url: ApiPrefix.FindFeeConfig,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeConfig = (data: FeeConfigParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeConfig,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeConfig = (data: FeeConfigParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeConfig}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeConfig = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeConfig}/${ids.join(',')}`
    })
    .then(res => res.data)
}
