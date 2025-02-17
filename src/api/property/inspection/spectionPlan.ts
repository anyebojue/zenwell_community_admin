import { request } from 'utils/request/axios'
import { FindSpectionPlanReply, SpectionPlanParams } from '../model/property/spectionPlanModel'

const ApiPrefix = {
  FindSpectionPlan: '/auth/spection_plan',
  CreateSpectionPlan: '/auth/spection_plan',
  UpdateSpectionPlan: '/auth/spection_plan',
  DeleteSpectionPlan: '/auth/spection_plan'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindSpectionPlan = (params: SpectionPlanParams & PaginationParams) => {
  return request
    .get<FindSpectionPlanReply>({
      url: ApiPrefix.FindSpectionPlan,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateSpectionPlan = (data: SpectionPlanParams) => {
  return request
    .post({
      url: ApiPrefix.CreateSpectionPlan,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateSpectionPlan = (data: SpectionPlanParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateSpectionPlan}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteSpectionPlan = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteSpectionPlan}/${ids.join(',')}`
    })
    .then(res => res.data)
}
