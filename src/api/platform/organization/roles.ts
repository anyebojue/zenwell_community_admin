import { request } from 'utils/request/axios'
import {
  FindRolesReply,
  FindRolesGroupReply,
  RolesParams,
  RolesGroupReply
} from '../../model/platform/organization/rolesModel'

const ApiPrefix = {
  RelevanceCommunity: '/auth/user_group_community_relation',
  FindRolesGroup: '/auth/user_group_community_relation',
  DeleteRolesGroup: '/auth/user_group_community_relation',
  FindRoles: '/auth/user/group',
  CreateRoles: '/auth/user/group',
  UpdateRoles: '/auth/user/group',
  DeleteRoles: '/auth/user/group'
}

/**
 * 关联小区
 * @param params userGroupId关联的角色ID communityId关联的小区ID
 * @returns
 */
export const RelevanceCommunity = (data: { userGroupId: string; communityId: string }) => {
  return request
    .post({
      url: ApiPrefix.RelevanceCommunity,
      data
    })
    .then(res => res.data)
}

/**
 * 查询员工关联接口
 * @param params User
 * @returns
 */
export const FindRolesGroup = (params: RolesGroupReply & PaginationParams) => {
  return request
    .get<FindRolesGroupReply>({
      url: ApiPrefix.FindRolesGroup,
      params
    })
    .then(res => res.data)
}

/**
 * 删除员工关联接口
 * @param ids
 * @returns
 */
export const DeleteRolesGroup = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteRolesGroup}/${ids.join(',')}`
    })
    .then(res => res.data)
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindRoles = (params: RolesParams & PaginationParams) => {
  return request
    .get<FindRolesReply>({
      url: ApiPrefix.FindRoles,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreateRoles = (data: RolesParams) => {
  return request
    .post({
      url: ApiPrefix.CreateRoles,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateRoles = (data: RolesParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateRoles}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteRoles = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteRoles}/${ids.join(',')}`
    })
    .then(res => res.data)
}
