import { request } from 'utils/request/axios'
import { FindSpaceReply, SpaceParams } from '../../model/property/houses/spaceModel'

const ApiPrefix = {
  FindSpace: '/auth/space',
  CreateSpace: '/auth/space',
  UpdateSpace: '/auth/space',
  DeleteSpace: '/auth/space'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindSpace = (params: SpaceParams & PaginationParams) => {
  return request
    .get<FindSpaceReply>({
      url: ApiPrefix.FindSpace,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateSpace = (data: SpaceParams) => {
  return request
    .post({
      url: ApiPrefix.CreateSpace,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateSpace = (data: SpaceParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateSpace}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteSpace = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteSpace}/${ids.join(',')}`
    })
    .then(res => res.data)
}
