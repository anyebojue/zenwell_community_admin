import { request } from 'utils/request/axios'
import { FindFloorReply, FloorParams } from '../../model/property/houses/floorModel'

const ApiPrefix = {
  FindFloor: '/auth/floor',
  CreateFloor: '/auth/floor',
  UpdateFloor: '/auth/floor',
  DeleteFloor: '/auth/floor'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFloor = (params: FloorParams & PaginationParams) => {
  return request
    .get<FindFloorReply>({
      url: ApiPrefix.FindFloor,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFloor = (data: FloorParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFloor,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFloor = (data: FloorParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFloor}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFloor = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFloor}/${ids.join(',')}`
    })
    .then(res => res.data)
}
