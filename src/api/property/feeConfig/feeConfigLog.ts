import { request } from 'utils/request/axios'
import {
  FindFeeConfigLogReply,
  FeeConfigLogParams
} from '../../model/property/feeConfig/feeConfigLogModel'

const ApiPrefix = {
  FindFeeConfigLog: '/fee/fee_config_log',
  CreateFeeConfigLog: '/fee/fee_config_log',
  UpdateFeeConfigLog: '/fee/fee_config_log',
  DeleteFeeConfigLog: '/fee/fee_config_log'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeConfigLog = (params: FeeConfigLogParams & PaginationParams) => {
  return request
    .get<FindFeeConfigLogReply>({
      url: ApiPrefix.FindFeeConfigLog,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeConfigLog = (data: FeeConfigLogParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeConfigLog,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeConfigLog = (data: FeeConfigLogParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeConfigLog}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeConfigLog = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeConfigLog}/${ids.join(',')}`
    })
    .then(res => res.data)
}
