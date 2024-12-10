import { request } from 'utils/request/axios'
import { FindPropertyCompanyReply, PropertyCompanyParams } from './model/propertyCompanyModel'

const ApiPrefix = {
  FindPropertyCompany: '/store',
  CreatePropertyCompany: '/store',
  UpdatePropertyCompany: '/store',
  DeletePropertyCompany: '/store'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindPropertyCompany = (params: PropertyCompanyParams & PaginationParams) => {
  return request
    .get<FindPropertyCompanyReply>({
      url: ApiPrefix.FindPropertyCompany,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreatePropertyCompany = (data: PropertyCompanyParams) => {
  return request
    .post({
      url: ApiPrefix.CreatePropertyCompany,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdatePropertyCompany = (data: PropertyCompanyParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdatePropertyCompany}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeletePropertyCompany = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeletePropertyCompany}/${ids.join(',')}`
    })
    .then(res => res.data)
}
