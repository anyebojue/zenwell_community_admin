import { request } from 'utils/request/axios'
import {
  FindResourceStoreTypeReply,
  ResourceStoreTypeParams
} from '../../model/property/purchase/resourceStoreTypeModel'

const ApiPrefix = {
  FindResourceStoreType: '/property/resource_store_type',
  CreateResourceStoreType: '/property/resource_store_type',
  UpdateResourceStoreType: '/property/resource_store_type',
  DeleteResourceStoreType: '/property/resource_store_type'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindResourceStoreType = (
  params: ResourceStoreTypeParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindResourceStoreTypeReply>({
      url: ApiPrefix.FindResourceStoreType,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateResourceStoreType = (data: ResourceStoreTypeParams) => {
  return request
    .post({
      url: ApiPrefix.CreateResourceStoreType,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateResourceStoreType = (data: ResourceStoreTypeParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateResourceStoreType}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteResourceStoreType = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteResourceStoreType}/${ids.join(',')}`
    })
    .then(res => res.data)
}
