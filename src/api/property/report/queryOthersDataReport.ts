import { request } from 'utils/request/axios'
import {
  FindQueryOthersDataReportReply,
  QueryOthersDataReportParams
} from '../../model/property/report/queryOthersDataReportModel'

const ApiPrefix = {
  FindQueryOthersDataReport: '/report/queryOthersDataReport'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryOthersDataReport = (
  params: QueryOthersDataReportParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryOthersDataReportReply>({
      url: ApiPrefix.FindQueryOthersDataReport,
      params
    })
    .then(res => res.data)
}
