import { request } from 'utils/request/axios'
import {
  FindQueryPayFeeDetailReply,
  QueryPayFeeDetailReply,
  SumTotal
} from '../../model/property/report/queryPayFeeDetailModel'

const ApiPrefix = {
  FindQueryPayFeeDetail: '/report/queryPayFeeDetail'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryPayFeeDetail = (
  params: QueryPayFeeDetailReply & PaginationParams & { isExport?: boolean; sumTotal?: SumTotal }
) => {
  return request
    .get<FindQueryPayFeeDetailReply>({
      url: ApiPrefix.FindQueryPayFeeDetail,
      params
    })
    .then(res => res.data)
}
