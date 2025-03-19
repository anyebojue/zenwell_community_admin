import { request } from 'utils/request/axios'
import {
  FindReportCustomComponentFooterReply,
  ReportCustomComponentFooterParams
} from '../../model/platform/reportConfiguration/reportCustomComponentFooterModel'

const ApiPrefix = {
  FindReportCustomComponentFooter: '/report/report_custom_component_footer',
  CreateReportCustomComponentFooter: '/report/report_custom_component_footer',
  UpdateReportCustomComponentFooter: '/report/report_custom_component_footer',
  DeleteReportCustomComponentFooter: '/report/report_custom_component_footer'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindReportCustomComponentFooter = (
  params: ReportCustomComponentFooterParams & PaginationParams
) => {
  return request
    .get<FindReportCustomComponentFooterReply>({
      url: ApiPrefix.FindReportCustomComponentFooter,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreateReportCustomComponentFooter = (data: ReportCustomComponentFooterParams) => {
  return request
    .post({
      url: ApiPrefix.CreateReportCustomComponentFooter,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateReportCustomComponentFooter = (data: ReportCustomComponentFooterParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateReportCustomComponentFooter}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteReportCustomComponentFooter = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteReportCustomComponentFooter}/${ids.join(',')}`
    })
    .then(res => res.data)
}
