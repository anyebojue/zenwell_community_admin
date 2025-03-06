import { request } from 'utils/request/axios'
import {
  FindQueryPrePaymentReply,
  QueryPrePaymentParams
} from '../../model/property/report/queryPrePaymentModel'

const ApiPrefix = {
  FindQueryPrePayment: '/report/queryPrePayment'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryPrePayment = (
  params: QueryPrePaymentParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryPrePaymentReply>({
      url: ApiPrefix.FindQueryPrePayment,
      params
    })
    .then(res => res.data)
}
