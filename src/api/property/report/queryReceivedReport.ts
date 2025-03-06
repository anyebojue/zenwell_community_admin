import { request } from 'utils/request/axios'
import {
  FindQueryReceivedReportReply,
  QueryReceivedReportParams
} from '../../model/property/report/queryReceivedReportModel'

const ApiPrefix = {
  FindQueryReceivedReport: '/report/queryReceivedReport'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryReceivedReport = (
  params: QueryReceivedReportParams & PaginationParams & { componentType?: string }
) => {
  return request
    .get<FindQueryReceivedReportReply>({
      url: ApiPrefix.FindQueryReceivedReport,
      params
    })
    .then(res => res.data)
}
