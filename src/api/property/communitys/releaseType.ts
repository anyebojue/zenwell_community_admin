import { request } from 'utils/request/axios'
import {
  FindReleaseTypeReply,
  ReleaseTypeParams
} from '../../model/property/communitys/releaseTypeModel'

const ApiPrefix = {
  FindReleaseType: '/auth/release_type',
  CreateReleaseType: '/auth/release_type',
  UpdateReleaseType: '/auth/release_type',
  DeleteReleaseType: '/auth/release_type'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindReleaseType = (params: ReleaseTypeParams & PaginationParams) => {
  return request
    .get<FindReleaseTypeReply>({
      url: ApiPrefix.FindReleaseType,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateReleaseType = (data: ReleaseTypeParams) => {
  return request
    .post({
      url: ApiPrefix.CreateReleaseType,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateReleaseType = (data: ReleaseTypeParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateReleaseType}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteReleaseType = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteReleaseType}/${ids.join(',')}`
    })
    .then(res => res.data)
}
