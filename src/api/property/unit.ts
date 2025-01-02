import { request } from 'utils/request/axios'
import { FindUnitReply, UnitParams } from '../model/property/unitModel'

const ApiPrefix = {
  FindUnit: '/auth/unit',
  CreateUnit: '/auth/unit',
  UpdateUnit: '/auth/unit',
  DeleteUnit: '/auth/unit'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindUnit = (params: UnitParams & PaginationParams) => {
  return request
    .get<FindUnitReply>({
      url: ApiPrefix.FindUnit,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateUnit = (data: UnitParams) => {
  return request
    .post({
      url: ApiPrefix.CreateUnit,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateUnit = (data: UnitParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateUnit}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteUnit = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteUnit}/${ids.join(',')}`
    })
    .then(res => res.data)
}
