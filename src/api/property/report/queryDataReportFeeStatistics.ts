import { request } from 'utils/request/axios'
import {
  FindQueryDataReportFeeStatisticsReply,
  QueryDataReportFeeStatisticsParams
} from '../../model/property/report/queryDataReportFeeStatisticsModel'

const ApiPrefix = {
  FindQueryDataReportFeeStatistics: '/report/queryDataReportFeeStatistics'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryDataReportFeeStatistics = (
  params: QueryDataReportFeeStatisticsParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryDataReportFeeStatisticsReply>({
      url: ApiPrefix.FindQueryDataReportFeeStatistics,
      params
    })
    .then(res => res.data)
}
