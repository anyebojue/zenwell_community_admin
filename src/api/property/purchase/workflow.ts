import { request } from 'utils/request/axios'
import { FindWorkflowReply, WorkflowParams } from '../../model/property/purchase/workflowModel'

const ApiPrefix = {
  FindWorkflow: '/property/workflow',
  CreateWorkflow: '/property/workflow',
  UpdateWorkflow: '/property/workflow',
  DeleteWorkflow: '/property/workflow'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindWorkflow = (
  params: WorkflowParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindWorkflowReply>({
      url: ApiPrefix.FindWorkflow,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateWorkflow = (data: WorkflowParams) => {
  return request
    .post({
      url: ApiPrefix.CreateWorkflow,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateWorkflow = (data: WorkflowParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateWorkflow}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteWorkflow = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteWorkflow}/${ids.join(',')}`
    })
    .then(res => res.data)
}
