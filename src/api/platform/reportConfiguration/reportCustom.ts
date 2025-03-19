import { request } from 'utils/request/axios'
import {
  FindReportCustomReply,
  ReportCustomParams
} from '../../model/platform/reportConfiguration/reportCustomModel'

const ApiPrefix = {
  FindReportCustom: '/report/report_custom',
  CreateReportCustom: '/report/report_custom',
  UpdateReportCustom: '/report/report_custom',
  DeleteReportCustom: '/report/report_custom'
}

/**
 * 查询接口
 * @param params User
 * @returns
 */
export const FindReportCustom = (params: ReportCustomParams & PaginationParams) => {
  return request
    .get<FindReportCustomReply>({
      url: ApiPrefix.FindReportCustom,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data AcivityParams
 * @returns
 */
export const CreateReportCustom = (data: ReportCustomParams) => {
  return request
    .post({
      url: ApiPrefix.CreateReportCustom,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data AcivityParams
 * @returns
 */
export const UpdateReportCustom = (data: ReportCustomParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateReportCustom}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteReportCustom = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteReportCustom}/${ids.join(',')}`
    })
    .then(res => res.data)
}
