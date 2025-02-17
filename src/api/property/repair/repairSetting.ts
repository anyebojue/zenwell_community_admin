import { request } from 'utils/request/axios'
import { FindRepairSettingReply, RepairSettingParams } from '../model/property/repairSettingModel'

const ApiPrefix = {
  FindRepairSetting: '/auth/repair_setting',
  CreateRepairSetting: '/auth/repair_setting',
  UpdateRepairSetting: '/auth/repair_setting',
  DeleteRepairSetting: '/auth/repair_setting'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindRepairSetting = (params: RepairSettingParams & PaginationParams) => {
  return request
    .get<FindRepairSettingReply>({
      url: ApiPrefix.FindRepairSetting,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateRepairSetting = (data: RepairSettingParams) => {
  return request
    .post({
      url: ApiPrefix.CreateRepairSetting,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateRepairSetting = (data: RepairSettingParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateRepairSetting}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteRepairSetting = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteRepairSetting}/${ids.join(',')}`
    })
    .then(res => res.data)
}
