import { request } from 'utils/request/axios'
import { FindStaffReply, StaffParams } from '../../model/property/repair/staffModel'

const ApiPrefix = {
  FindStaff: '/auth/spection_plan_staff',
  CreateStaff: '/auth/spection_plan_staff',
  UpdateStaff: '/auth/spection_plan_staff',
  DeleteStaff: '/auth/spection_plan_staff'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindStaff = (params: StaffParams & PaginationParams) => {
  return request
    .get<FindStaffReply>({
      url: ApiPrefix.FindStaff,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateStaff = (data: StaffParams) => {
  return request
    .post({
      url: ApiPrefix.CreateStaff,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateStaff = (data: StaffParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateStaff}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteStaff = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteStaff}/${ids.join(',')}`
    })
    .then(res => res.data)
}
