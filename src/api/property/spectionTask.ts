import { request } from 'utils/request/axios'
import { FindSpectionTaskReply, SpectionTaskParams } from '../model/property/spectionTaskModel'

const ApiPrefix = {
  FindSpectionTask: '/auth/spection_task',
  CreateSpectionTask: '/auth/spection_task',
  UpdateSpectionTask: '/auth/spection_task',
  DeleteSpectionTask: '/auth/spection_task'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindSpectionTask = (params: SpectionTaskParams & PaginationParams) => {
  return request
    .get<FindSpectionTaskReply>({
      url: ApiPrefix.FindSpectionTask,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateSpectionTask = (data: SpectionTaskParams) => {
  return request
    .post({
      url: ApiPrefix.CreateSpectionTask,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateSpectionTask = (data: SpectionTaskParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateSpectionTask}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteSpectionTask = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteSpectionTask}/${ids.join(',')}`
    })
    .then(res => res.data)
}
