import { request } from 'utils/request/axios'
import {
  FindQueryOweStatisticsReply,
  QueryOweStatisticsParams
} from '../../model/property/report/queryOweStatisticsModel'

const ApiPrefix = {
  FindQueryOweStatistics: '/report/queryOweStatistics'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryOweStatistics = (
  params: QueryOweStatisticsParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryOweStatisticsReply>({
      url: ApiPrefix.FindQueryOweStatistics,
      params
    })
    .then(res => res.data)
}
