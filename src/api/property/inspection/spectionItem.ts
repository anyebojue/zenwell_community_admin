import { request } from 'utils/request/axios'
import {
  FindSpectionItemReply,
  SpectionItemParams
} from '../../model/property/inspection/spectionItemModel'

const ApiPrefix = {
  FindSpectionItem: '/auth/spection_item',
  CreateSpectionItem: '/auth/spection_item',
  UpdateSpectionItem: '/auth/spection_item',
  DeleteSpectionItem: '/auth/spection_item'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindSpectionItem = (params: SpectionItemParams & PaginationParams) => {
  return request
    .get<FindSpectionItemReply>({
      url: ApiPrefix.FindSpectionItem,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateSpectionItem = (data: SpectionItemParams) => {
  return request
    .post({
      url: ApiPrefix.CreateSpectionItem,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateSpectionItem = (data: SpectionItemParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateSpectionItem}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteSpectionItem = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteSpectionItem}/${ids.join(',')}`
    })
    .then(res => res.data)
}
