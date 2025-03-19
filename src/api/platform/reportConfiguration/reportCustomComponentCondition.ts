import { request } from 'utils/request/axios'
import {
  FindReportCustomComponentConditionReply,
  ReportCustomComponentConditionParams
} from '../../model/platform/reportConfiguration/reportCustomComponentConditionModel'

const ApiPrefix = {
  FindReportCustomComponentCondition: '/report/report_custom_component_condition',
  CreateReportCustomComponentCondition: '/report/report_custom_component_condition',
  UpdateReportCustomComponentCondition: '/report/report_custom_component_condition',
  DeleteReportCustomComponentCondition: '/report/report_custom_component_condition'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindReportCustomComponentCondition = (
  params: ReportCustomComponentConditionParams & PaginationParams
) => {
  return request
    .get<FindReportCustomComponentConditionReply>({
      url: ApiPrefix.FindReportCustomComponentCondition,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreateReportCustomComponentCondition = (
  data: ReportCustomComponentConditionParams
) => {
  return request
    .post({
      url: ApiPrefix.CreateReportCustomComponentCondition,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateReportCustomComponentCondition = (
  data: ReportCustomComponentConditionParams
) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateReportCustomComponentCondition}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteReportCustomComponentCondition = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteReportCustomComponentCondition}/${ids.join(',')}`
    })
    .then(res => res.data)
}
