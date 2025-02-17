import { request } from 'utils/request/axios'
import { FindSpectionReply, SpectionParams } from '../../model/property/inspection/spectionModel'

const ApiPrefix = {
  FindSpection: '/auth/spection',
  CreateSpection: '/auth/spection',
  UpdateSpection: '/auth/spection',
  DeleteSpection: '/auth/spection'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindSpection = (params: SpectionParams & PaginationParams) => {
  return request
    .get<FindSpectionReply>({
      url: ApiPrefix.FindSpection,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateSpection = (data: SpectionParams) => {
  return request
    .post({
      url: ApiPrefix.CreateSpection,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateSpection = (data: SpectionParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateSpection}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteSpection = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteSpection}/${ids.join(',')}`
    })
    .then(res => res.data)
}
