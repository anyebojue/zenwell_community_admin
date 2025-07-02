import { request } from 'utils/request/axios'
import {
  FindQueryMonthReceivedDetailReply,
  QueryMonthReceivedDetailParams
} from '../../model/property/report/queryMonthReceivedDetailModel'

const ApiPrefix = {
  FindQueryMonthReceivedDetail: '/report/queryMonthReceivedDetail'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryMonthReceivedDetail = (
  params: QueryMonthReceivedDetailParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryMonthReceivedDetailReply>({
      url: ApiPrefix.FindQueryMonthReceivedDetail,
      params
    })
    .then(res => res.data)
}
