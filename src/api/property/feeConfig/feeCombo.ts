import { request } from 'utils/request/axios'
import { FindFeeComboReply, FeeComboParams } from '../../model/property/feeConfig/feeComboModel'

const ApiPrefix = {
  FindFeeCombo: '/fee/fee_combo',
  CreateFeeCombo: '/fee/fee_combo',
  UpdateFeeCombo: '/fee/fee_combo',
  DeleteFeeCombo: '/fee/fee_combo'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeCombo = (params: FeeComboParams & PaginationParams) => {
  return request
    .get<FindFeeComboReply>({
      url: ApiPrefix.FindFeeCombo,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeCombo = (data: FeeComboParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeCombo,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeCombo = (data: FeeComboParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeCombo}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeCombo = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeCombo}/${ids.join(',')}`
    })
    .then(res => res.data)
}
