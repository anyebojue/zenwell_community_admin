import { request } from 'utils/request/axios'
import {
  FindQueryRepairReportReply,
  QueryRepairReportParams
} from '../../model/property/report/queryRepairReportModel'

const ApiPrefix = {
  FindQueryRepairReport: '/report/queryRepairReport'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryRepairReport = (
  params: QueryRepairReportParams & PaginationParams & { componentType?: string }
) => {
  return request
    .get<FindQueryRepairReportReply>({
      url: ApiPrefix.FindQueryRepairReport,
      params
    })
    .then(res => res.data)
}
