import { request } from 'utils/request/axios'
import { FindEmployeesReply, EmployeesParams } from '../model/platform/employeesModel'

const ApiPrefix = {
  FindEmployees: '/auth/org_user',
  CreateEmployees: '/auth/org_user',
  UpdateEmployees: '/auth/org_user',
  DeleteEmployees: '/auth/org_user'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindEmployees = (params: EmployeesParams & PaginationParams) => {
  return request
    .get<FindEmployeesReply>({
      url: ApiPrefix.FindEmployees,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreateEmployees = (data: EmployeesParams) => {
  return request
    .post({
      url: ApiPrefix.CreateEmployees,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateEmployees = (data: EmployeesParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateEmployees}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteEmployees = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteEmployees}/${ids.join(',')}`
    })
    .then(res => res.data)
}
