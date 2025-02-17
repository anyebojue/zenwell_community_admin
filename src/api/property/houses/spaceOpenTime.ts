import { request } from 'utils/request/axios'
import {
  FindSpaceOpenTimeReply,
  SpaceOpenTimeParams
} from '../../model/property/houses/spaceOpenTimeModel'

const ApiPrefix = {
  FindSpaceOpenTime: '/auth/space_open_time',
  CreateSpaceOpenTime: '/auth/space_open_time',
  UpdateSpaceOpenTime: '/auth/space_open_time',
  DeleteSpaceOpenTime: '/auth/space_open_time'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindSpaceOpenTime = (params: SpaceOpenTimeParams & PaginationParams) => {
  return request
    .get<FindSpaceOpenTimeReply>({
      url: ApiPrefix.FindSpaceOpenTime,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateSpaceOpenTime = (data: SpaceOpenTimeParams) => {
  return request
    .post({
      url: ApiPrefix.CreateSpaceOpenTime,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateSpaceOpenTime = (data: SpaceOpenTimeParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateSpaceOpenTime}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteSpaceOpenTime = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteSpaceOpenTime}/${ids.join(',')}`
    })
    .then(res => res.data)
}
