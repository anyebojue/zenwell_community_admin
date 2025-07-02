import { request } from 'utils/request/axios'
import {
  FindFeeComboMemberReply,
  FeeComboMemberParams
} from '../../model/property/feeConfig/feeComboMemberModel'

const ApiPrefix = {
  FindFeeComboMember: '/fee/fee_combo_member',
  CreateFeeComboMember: '/fee/fee_combo_member',
  UpdateFeeComboMember: '/fee/fee_combo_member',
  DeleteFeeComboMember: '/fee/fee_combo_member'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeComboMember = (params: FeeComboMemberParams & PaginationParams) => {
  return request
    .get<FindFeeComboMemberReply>({
      url: ApiPrefix.FindFeeComboMember,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeComboMember = (data: FeeComboMemberParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeComboMember,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeComboMember = (data: FeeComboMemberParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeComboMember}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeComboMember = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeComboMember}/${ids.join(',')}`
    })
    .then(res => res.data)
}
