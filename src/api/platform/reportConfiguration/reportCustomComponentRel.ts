import { request } from 'utils/request/axios'
import {
  FindReportCustomComponentRelReply,
  ReportCustomComponentRelParams
} from '../../model/platform/reportConfiguration/reportCustomComponentRelModel'

const ApiPrefix = {
  FindReportCustomComponentRel: '/report/report_custom_component_rel',
  CreateReportCustomComponentRel: '/report/report_custom_component_rel',
  UpdateReportCustomComponentRel: '/report/report_custom_component_rel',
  DeleteReportCustomComponentRel: '/report/report_custom_component_rel'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindReportCustomComponentRel = (
  params: ReportCustomComponentRelParams & PaginationParams
) => {
  return request
    .get<FindReportCustomComponentRelReply>({
      url: ApiPrefix.FindReportCustomComponentRel,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreateReportCustomComponentRel = (data: ReportCustomComponentRelParams) => {
  return request
    .post({
      url: ApiPrefix.CreateReportCustomComponentRel,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateReportCustomComponentRel = (data: ReportCustomComponentRelParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateReportCustomComponentRel}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteReportCustomComponentRel = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteReportCustomComponentRel}/${ids.join(',')}`
    })
    .then(res => res.data)
}
