import { request } from 'utils/request/axios'
import {
  FindQueryInspectionReportReply,
  QueryInspectionReportParams
} from '../../model/property/report/queryInspectionReportModel'

const ApiPrefix = {
  FindQueryInspectionReport: '/report/queryInspectionReport'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryInspectionReport = (
  params: QueryInspectionReportParams & PaginationParams & { componentType?: string }
) => {
  return request
    .get<FindQueryInspectionReportReply>({
      url: ApiPrefix.FindQueryInspectionReport,
      params
    })
    .then(res => res.data)
}
