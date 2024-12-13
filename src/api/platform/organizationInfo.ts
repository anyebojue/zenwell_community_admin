import { request } from 'utils/request/axios'
import {
  OrgUserReply,
  FindOrgUserReply,
  FindOrganizationInfoReply,
  OrganizationInfoParams
} from '../model/platform/organizationInfoModel'

const ApiPrefix = {
  FindOrgUser: '/auth/org_user',
  FindOrganizationInfo: '/auth/org_tree',
  CreateOrganizationInfo: '/auth/org',
  UpdateOrganizationInfo: '/auth/org',
  DeleteOrganizationInfo: '/auth/org'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindOrgUser = (params: OrgUserReply & PaginationParams) => {
  return request
    .get<FindOrgUserReply>({
      url: ApiPrefix.FindOrgUser,
      params
    })
    .then(res => res.data)
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindOrganizationInfo = (params: OrganizationInfoParams & PaginationParams) => {
  return request
    .get<FindOrganizationInfoReply>({
      url: ApiPrefix.FindOrganizationInfo,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreateOrganizationInfo = (data: OrganizationInfoParams) => {
  return request
    .post({
      url: ApiPrefix.CreateOrganizationInfo,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateOrganizationInfo = (data: OrganizationInfoParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateOrganizationInfo}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteOrganizationInfo = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteOrganizationInfo}/${ids.join(',')}`
    })
    .then(res => res.data)
}
