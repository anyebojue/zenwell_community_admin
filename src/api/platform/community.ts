import { request } from 'utils/request/axios'
import { FindCommunityReply, CommunityParams } from '../model/platform/communityModel'

const ApiPrefix = {
  FindCommunity: '/auth/community',
  CreateCommunity: '/auth/community',
  UpdateCommunity: '/auth/community',
  DeleteCommunity: '/auth/community'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindCommunity = (params: CommunityParams & PaginationParams) => {
  return request
    .get<FindCommunityReply>({
      url: ApiPrefix.FindCommunity,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreateCommunity = (data: CommunityParams) => {
  return request
    .post({
      url: ApiPrefix.CreateCommunity,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateCommunity = (data: CommunityParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateCommunity}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteCommunity = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteCommunity}/${ids.join(',')}`
    })
    .then(res => res.data)
}
