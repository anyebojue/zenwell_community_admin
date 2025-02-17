import { request } from 'utils/request/axios'
import {
  FindSpectionPointReply,
  FindSpectionRoutePointReply,
  SpectionPointParams,
  SpectionRoutePointParams
} from '../../model/property/inspection/spectionPointModel'

const ApiPrefix = {
  CreatePoint: '/auth/spection_route_point',
  DeletePoint: '/auth/spection_route_point',
  FindPoint: '/auth/spection_route_point',
  FindSpectionPoint: '/auth/spection_point',
  CreateSpectionPoint: '/auth/spection_point',
  UpdateSpectionPoint: '/auth/spection_point',
  DeleteSpectionPoint: '/auth/spection_point'
}

/**
 * 添加修改巡检点接口
 * @param data
 * @returns
 */
export const CreatePoint = (data: SpectionPointParams) => {
  return request
    .post({
      url: ApiPrefix.CreatePoint,
      data
    })
    .then(res => res.data)
}

/**
 * 解绑巡检点接口
 * @param data
 * @returns
 */
export const DeletePoint = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeletePoint}/${ids.join(',')}`
    })
    .then(res => res.data)
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindPoint = (params: SpectionRoutePointParams & PaginationParams) => {
  return request
    .get<FindSpectionRoutePointReply>({
      url: ApiPrefix.FindPoint,
      params
    })
    .then(res => res.data)
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindSpectionPoint = (params: SpectionPointParams & PaginationParams) => {
  return request
    .get<FindSpectionPointReply>({
      url: ApiPrefix.FindSpectionPoint,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateSpectionPoint = (data: SpectionPointParams) => {
  return request
    .post({
      url: ApiPrefix.CreateSpectionPoint,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateSpectionPoint = (data: SpectionPointParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateSpectionPoint}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteSpectionPoint = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteSpectionPoint}/${ids.join(',')}`
    })
    .then(res => res.data)
}
