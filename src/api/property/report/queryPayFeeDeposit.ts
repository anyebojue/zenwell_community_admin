import { request } from 'utils/request/axios'
import {
  FindReportFeeYearCollectionDetailReply,
  ReportFeeYearCollectionDetailReply
} from '../../model/property/report/queryPayFeeDepositModel'

const ApiPrefix = {
  FindQueryPayFeeDeposit: '/report/queryPayFeeDeposit'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryPayFeeDeposit = (
  params: ReportFeeYearCollectionDetailReply & PaginationParams
) => {
  return request
    .get<FindReportFeeYearCollectionDetailReply>({
      url: ApiPrefix.FindQueryPayFeeDeposit,
      params
    })
    .then(res => res.data)
}
