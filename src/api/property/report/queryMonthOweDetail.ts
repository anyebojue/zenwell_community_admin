import { request } from 'utils/request/axios'
import {
  FindQueryMonthOweDetailReply,
  QueryMonthOweDetailParams
} from '../../model/property/report/queryMonthOweDetailModel'

const ApiPrefix = {
  FindQueryMonthOweDetail: '/report/queryMonthOweDetail'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryMonthOweDetail = (
  params: QueryMonthOweDetailParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryMonthOweDetailReply>({
      url: ApiPrefix.FindQueryMonthOweDetail,
      params
    })
    .then(res => res.data)
}
