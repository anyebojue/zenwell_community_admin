import { request } from 'utils/request/axios'
import {
  FindResourceStoreReply,
  ResourceStoreParams
} from '../../model/property/purchase/resourceStoreModel'

const ApiPrefix = {
  FindResourceStore: '/property/resource_store',
  CreateResourceStore: '/property/resource_store',
  UpdateResourceStore: '/property/resource_store',
  DeleteResourceStore: '/property/resource_store'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindResourceStore = (
  params: ResourceStoreParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindResourceStoreReply>({
      url: ApiPrefix.FindResourceStore,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateResourceStore = (data: ResourceStoreParams) => {
  return request
    .post({
      url: ApiPrefix.CreateResourceStore,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateResourceStore = (data: ResourceStoreParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateResourceStore}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteResourceStore = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteResourceStore}/${ids.join(',')}`
    })
    .then(res => res.data)
}
