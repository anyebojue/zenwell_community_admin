import { request } from 'utils/request/axios'
import {
  FindStorehouseReply,
  StorehouseParams
} from '../../model/property/purchase/storehouseModel'

const ApiPrefix = {
  FindStorehouse: '/property/storehouse',
  CreateStorehouse: '/property/storehouse',
  UpdateStorehouse: '/property/storehouse',
  DeleteStorehouse: '/property/storehouse'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindStorehouse = (
  params: StorehouseParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindStorehouseReply>({
      url: ApiPrefix.FindStorehouse,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateStorehouse = (data: StorehouseParams) => {
  return request
    .post({
      url: ApiPrefix.CreateStorehouse,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateStorehouse = (data: StorehouseParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateStorehouse}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteStorehouse = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteStorehouse}/${ids.join(',')}`
    })
    .then(res => res.data)
}
