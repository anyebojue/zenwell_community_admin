import { request } from 'utils/request/axios'
import {
  CompanyReply,
  FindCompanyReply,
  FindPropertyCompanyReply,
  PropertyCompanyParams
} from '../model/platform/propertyCompanyModel'

const ApiPrefix = {
  FindCompany: '/auth/store_community_relation',
  CreateCompany: '/auth/store_community_relation',
  DeleteCompany: '/auth/store_community_relation',
  FindPropertyCompany: '/auth/store',
  CreatePropertyCompany: '/auth/store',
  UpdatePropertyCompany: '/auth/store',
  DeletePropertyCompany: '/auth/store'
}

/**
 * 加入的小区查询接口
 * @param params User
 * @returns
 */
export const FindCompany = (params: PaginationParams & CompanyReply) => {
  return request
    .get<FindCompanyReply>({
      url: ApiPrefix.FindCompany,
      params
    })
    .then(res => res.data)
}

/**
 * 加入小区接口
 * @param data storeId communityId
 * @returns
 */
export const CreateCompany = (data: { storeId: string; communityId: string }) => {
  return request
    .post({
      url: ApiPrefix.CreateCompany,
      data
    })
    .then(res => res.data)
}

/**
 * 退出小区接口
 * @param id
 * @returns
 */
export const DeleteCompany = (id: string) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteCompany}/${id}`
    })
    .then(res => res.data)
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
