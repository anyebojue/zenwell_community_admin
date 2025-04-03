import { request } from 'utils/request/axios'
import { FindStoreTypeReply, StoreTypeParams } from '../../model/property/purchase/storeTypeModel'

const ApiPrefix = {
  FindStoreType: '/property/store_type',
  CreateStoreType: '/property/store_type',
  UpdateStoreType: '/property/store_type',
  DeleteStoreType: '/property/store_type'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindStoreType = (
  params: StoreTypeParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindStoreTypeReply>({
      url: ApiPrefix.FindStoreType,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateStoreType = (data: StoreTypeParams) => {
  return request
    .post({
      url: ApiPrefix.CreateStoreType,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateStoreType = (data: StoreTypeParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateStoreType}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteStoreType = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteStoreType}/${ids.join(',')}`
    })
    .then(res => res.data)
}
