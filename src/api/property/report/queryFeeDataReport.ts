import { request } from 'utils/request/axios'
import {
  FindQueryFeeDataReportReply,
  QueryFeeDataReportParams
} from '../../model/property/report/queryFeeDataReportModel'

const ApiPrefix = {
  FindQueryFeeDataReport: '/report/queryFeeDataReport'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryFeeDataReport = (
  params: QueryFeeDataReportParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryFeeDataReportReply>({
      url: ApiPrefix.FindQueryFeeDataReport,
      params
    })
    .then(res => res.data)
}
