import { request } from 'utils/request/axios'
import {
  FindReportCustomComponentReply,
  ReportCustomComponentParams
} from '../../model/platform/reportConfiguration/reportCustomComponentModel'

const ApiPrefix = {
  FindReportCustomComponent: '/report/report_custom_component',
  CreateReportCustomComponent: '/report/report_custom_component',
  UpdateReportCustomComponent: '/report/report_custom_component',
  DeleteReportCustomComponent: '/report/report_custom_component'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindReportCustomComponent = (
  params: ReportCustomComponentParams & PaginationParams
) => {
  return request
    .get<FindReportCustomComponentReply>({
      url: ApiPrefix.FindReportCustomComponent,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreateReportCustomComponent = (data: ReportCustomComponentParams) => {
  return request
    .post({
      url: ApiPrefix.CreateReportCustomComponent,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateReportCustomComponent = (data: ReportCustomComponentParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateReportCustomComponent}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteReportCustomComponent = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteReportCustomComponent}/${ids.join(',')}`
    })
    .then(res => res.data)
}
