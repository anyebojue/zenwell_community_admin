import { request } from 'utils/request/axios'
import {
  FindQueryReportOwnerPayFeeReply,
  QueryReportOwnerPayFeeParams
} from '../../model/property/report/queryReportOwnerPayFeeModel'

const ApiPrefix = {
  FindQueryReportOwnerPayFee: '/report/queryReportOwnerPayFee'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryReportOwnerPayFee = (params: QueryReportOwnerPayFeeParams) => {
  return request
    .get<FindQueryReportOwnerPayFeeReply>({
      url: ApiPrefix.FindQueryReportOwnerPayFee,
      params
    })
    .then(res => res.data)
}
