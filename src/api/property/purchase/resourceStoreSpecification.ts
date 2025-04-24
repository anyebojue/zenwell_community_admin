import { request } from 'utils/request/axios'
import {
  FindResourceStoreSpecificationReply,
  ResourceStoreSpecificationParams
} from '../../model/property/purchase/resourceStoreSpecificationModel'

const ApiPrefix = {
  FindResourceStoreSpecification: '/property/resource_store_specification',
  CreateResourceStoreSpecification: '/property/resource_store_specification',
  UpdateResourceStoreSpecification: '/property/resource_store_specification',
  DeleteResourceStoreSpecification: '/property/resource_store_specification'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindResourceStoreSpecification = (
  params: ResourceStoreSpecificationParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindResourceStoreSpecificationReply>({
      url: ApiPrefix.FindResourceStoreSpecification,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateResourceStoreSpecification = (data: ResourceStoreSpecificationParams) => {
  return request
    .post({
      url: ApiPrefix.CreateResourceStoreSpecification,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateResourceStoreSpecification = (data: ResourceStoreSpecificationParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateResourceStoreSpecification}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteResourceStoreSpecification = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteResourceStoreSpecification}/${ids.join(',')}`
    })
    .then(res => res.data)
}
