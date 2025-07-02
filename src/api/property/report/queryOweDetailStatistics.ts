import { request } from 'utils/request/axios'
import {
  FindQueryOweDetailStatisticsReply,
  QueryOweDetailStatisticsParams
} from '../../model/property/report/queryOweDetailStatisticsModel'

const ApiPrefix = {
  FindQueryOweDetailStatistics: '/report/queryOweDetailStatistics'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryOweDetailStatistics = (
  params: QueryOweDetailStatisticsParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryOweDetailStatisticsReply>({
      url: ApiPrefix.FindQueryOweDetailStatistics,
      params
    })
    .then(res => res.data)
}
