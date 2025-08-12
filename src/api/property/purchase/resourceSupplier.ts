import { request } from 'utils/request/axios'
import {
  FindResourceSupplierReply,
  ResourceSupplierParams
} from '../../model/property/purchase/resourceSupplierModel'

const ApiPrefix = {
  FindResourceSupplier: '/property/resource_supplier',
  CreateResourceSupplier: '/property/resource_supplier',
  UpdateResourceSupplier: '/property/resource_supplier',
  DeleteResourceSupplier: '/property/resource_supplier'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindResourceSupplier = (params: ResourceSupplierParams & PaginationParams) => {
  return request
    .get<FindResourceSupplierReply>({
      url: ApiPrefix.FindResourceSupplier,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateResourceSupplier = (data: ResourceSupplierParams) => {
  return request
    .post({
      url: ApiPrefix.CreateResourceSupplier,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateResourceSupplier = (data: ResourceSupplierParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateResourceSupplier}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteResourceSupplier = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteResourceSupplier}/${ids.join(',')}`
    })
    .then(res => res.data)
}
