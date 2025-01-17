import { request } from 'utils/request/axios'
import {
  FindSpectionTaskDetailReply,
  SpectionTaskDetailParams
} from '../model/property/spectionTaskDetailModel'

const ApiPrefix = {
  FindSpectionTaskDetail: '/auth/spection_task_detail',
  CreateSpectionTaskDetail: '/auth/spection_task_detail',
  UpdateSpectionTaskDetail: '/auth/spection_task_detail',
  DeleteSpectionTaskDetail: '/auth/spection_task_detail'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindSpectionTaskDetail = (params: SpectionTaskDetailParams & PaginationParams) => {
  return request
    .get<FindSpectionTaskDetailReply>({
      url: ApiPrefix.FindSpectionTaskDetail,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateSpectionTaskDetail = (data: SpectionTaskDetailParams) => {
  return request
    .post({
      url: ApiPrefix.CreateSpectionTaskDetail,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateSpectionTaskDetail = (data: SpectionTaskDetailParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateSpectionTaskDetail}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteSpectionTaskDetail = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteSpectionTaskDetail}/${ids.join(',')}`
    })
    .then(res => res.data)
}
