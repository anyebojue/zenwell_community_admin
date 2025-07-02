import { request } from 'utils/request/axios'
import {
  FindQueryReceivedWayStatisticsReply,
  QueryReceivedWayStatisticsParams
} from '../../model/property/report/queryReceivedWayStatisticsModel'

const ApiPrefix = {
  FindQueryReceivedWayStatistics: '/report/queryReceivedWayStatistics'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryReceivedWayStatistics = (
  params: QueryReceivedWayStatisticsParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryReceivedWayStatisticsReply>({
      url: ApiPrefix.FindQueryReceivedWayStatistics,
      params
    })
    .then(res => res.data)
}
