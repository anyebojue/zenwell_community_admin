import { request } from 'utils/request/axios'
import {
  FindQueryOweFeeDetailReply,
  QueryOweFeeDetailParams
} from '../../model/property/report/queryOweFeeDetailModel'

const ApiPrefix = {
  FindQueryOweFeeDetail: '/report/queryOweFeeDetail'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryOweFeeDetail = (
  params: QueryOweFeeDetailParams &
    PaginationParams & { isExport?: boolean; totalPreferentialAmount: string; allOweAmount: string }
) => {
  return request
    .get<FindQueryOweFeeDetailReply>({
      url: ApiPrefix.FindQueryOweFeeDetail,
      params
    })
    .then(res => res.data)
}
