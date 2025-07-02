import { request } from 'utils/request/axios'
import {
  FindQueryReceivedDetailStatisticsReply,
  QueryReceivedDetailStatisticsParams
} from '../../model/property/report/queryReceivedDetailStatisticsModel'

const ApiPrefix = {
  FindQueryReceivedDetailStatistics: '/report/queryReceivedDetailStatistics'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryReceivedDetailStatistics = (
  params: QueryReceivedDetailStatisticsParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryReceivedDetailStatisticsReply>({
      url: ApiPrefix.FindQueryReceivedDetailStatistics,
      params
    })
    .then(res => res.data)
}
