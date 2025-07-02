import { request } from 'utils/request/axios'
import {
  FindQueryInoutDataReportReply,
  QueryInoutDataReportParams
} from '../../model/property/report/queryInoutDataReportModel'

const ApiPrefix = {
  FindQueryInoutDataReport: '/report/queryInoutDataReport'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryInoutDataReport = (
  params: QueryInoutDataReportParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryInoutDataReportReply>({
      url: ApiPrefix.FindQueryInoutDataReport,
      params
    })
    .then(res => res.data)
}
