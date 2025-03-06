import { request } from 'utils/request/axios'
import {
  FindQueryOrderDataReportReply,
  QueryOrderDataReportParams
} from '../../model/property/report/queryOrderDataReportModel'

const ApiPrefix = {
  FindQueryOrderDataReport: '/report/queryOrderDataReport'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryOrderDataReport = (
  params: QueryOrderDataReportParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryOrderDataReportReply>({
      url: ApiPrefix.FindQueryOrderDataReport,
      params
    })
    .then(res => res.data)
}
