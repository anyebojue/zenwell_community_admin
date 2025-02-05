import { request } from 'utils/request/axios'
import { FindReleaseReply, ReleaseParams } from '../model/property/releaseModel'

const ApiPrefix = {
  FindRelease: '/auth/release',
  CreateRelease: '/auth/release',
  UpdateRelease: '/auth/release',
  DeleteRelease: '/auth/release'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindRelease = (params: ReleaseParams & PaginationParams) => {
  return request
    .get<FindReleaseReply>({
      url: ApiPrefix.FindRelease,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateRelease = (data: ReleaseParams) => {
  return request
    .post({
      url: ApiPrefix.CreateRelease,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateRelease = (data: ReleaseParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateRelease}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteRelease = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteRelease}/${ids.join(',')}`
    })
    .then(res => res.data)
}
