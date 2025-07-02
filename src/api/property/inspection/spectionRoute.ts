import { request } from 'utils/request/axios'
import {
  FindSpectionRouteReply,
  SpectionRouteParams
} from '../../model/property/inspection/spectionRouteModel'

const ApiPrefix = {
  FindSpectionRoute: '/auth/spection_route',
  CreateSpectionRoute: '/auth/spection_route',
  UpdateSpectionRoute: '/auth/spection_route',
  DeleteSpectionRoute: '/auth/spection_route'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindSpectionRoute = (params: SpectionRouteParams & PaginationParams) => {
  return request
    .get<FindSpectionRouteReply>({
      url: ApiPrefix.FindSpectionRoute,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateSpectionRoute = (data: SpectionRouteParams) => {
  return request
    .post({
      url: ApiPrefix.CreateSpectionRoute,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateSpectionRoute = (data: SpectionRouteParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateSpectionRoute}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteSpectionRoute = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteSpectionRoute}/${ids.join(',')}`
    })
    .then(res => res.data)
}
