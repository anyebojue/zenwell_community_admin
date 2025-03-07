import { request } from 'utils/request/axios'
import {
  FindQueryReceivedStatisticsReply,
  QueryReceivedStatisticsParams
} from '../../model/property/report/queryReceivedStatisticsModel'

const ApiPrefix = {
  FindQueryReceivedStatistics: '/report/queryReceivedStatistics'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryReceivedStatistics = (
  params: QueryReceivedStatisticsParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryReceivedStatisticsReply>({
      url: ApiPrefix.FindQueryReceivedStatistics,
      params
    })
    .then(res => res.data)
}
