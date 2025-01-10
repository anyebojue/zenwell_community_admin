import { request } from 'utils/request/axios'
import { FindRepairStaffReply, RepairStaffParams } from '../model/property/repairStaffModel'

const ApiPrefix = {
  FindRepairStaff: '/auth/repair_staff',
  CreateRepairStaff: '/auth/repair_staff',
  UpdateRepairStaff: '/auth/repair_staff',
  DeleteRepairStaff: '/auth/repair_staff'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindRepairStaff = (params: RepairStaffParams & PaginationParams) => {
  return request
    .get<FindRepairStaffReply>({
      url: ApiPrefix.FindRepairStaff,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateRepairStaff = (data: RepairStaffParams) => {
  return request
    .post({
      url: ApiPrefix.CreateRepairStaff,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateRepairStaff = (data: RepairStaffParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateRepairStaff}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteRepairStaff = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteRepairStaff}/${ids.join(',')}`
    })
    .then(res => res.data)
}
