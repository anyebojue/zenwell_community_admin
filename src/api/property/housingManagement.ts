import { request } from 'utils/request/axios'
import {
  FindHousingManagementReply,
  HousingManagementParams
} from '../model/property/housingManagementModel'

const ApiPrefix = {
  FindHousingManagement: '/auth/floor',
  CreateHousingManagement: '/auth/floor',
  UpdateHousingManagement: '/auth/floor',
  DeleteHousingManagement: '/auth/floor'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindHousingManagement = (params: HousingManagementParams & PaginationParams) => {
  return request
    .get<FindHousingManagementReply>({
      url: ApiPrefix.FindHousingManagement,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateHousingManagement = (data: HousingManagementParams) => {
  return request
    .post({
      url: ApiPrefix.CreateHousingManagement,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateHousingManagement = (data: HousingManagementParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateHousingManagement}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteHousingManagement = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteHousingManagement}/${ids.join(',')}`
    })
    .then(res => res.data)
}
