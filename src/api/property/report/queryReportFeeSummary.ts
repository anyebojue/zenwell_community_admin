import { request } from 'utils/request/axios'
import {
  FindQueryReportFeeSummaryReply,
  QueryReportFeeSummaryParams
} from '../../model/property/report/queryReportFeeSummaryModel'

const ApiPrefix = {
  FindQueryReportFeeSummary: '/report/queryReportFeeSummary'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryReportFeeSummary = (
  params: QueryReportFeeSummaryParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryReportFeeSummaryReply>({
      url: ApiPrefix.FindQueryReportFeeSummary,
      params
    })
    .then(res => res.data)
}
