import { request } from 'utils/request/axios'
import {
  FindSystemSettingsReply,
  SystemSettingsParams
} from '../model/property/systemSettingsModel'

const ApiPrefix = {
  FindSystemSettings: '/auth/setting',
  UpdateSystemSettings: '/auth/setting'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindSystemSettings = (params: SystemSettingsParams & PaginationParams) => {
  return request
    .get<FindSystemSettingsReply>({
      url: ApiPrefix.FindSystemSettings,
      params
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateSystemSettings = (data: SystemSettingsParams) => {
  return request
    .post({
      url: `${ApiPrefix.UpdateSystemSettings}`,
      data
    })
    .then(res => res.data)
}
