import { request } from 'utils/request/axios'
import {
  FindQueryDeadlineFeeReply,
  QueryDeadlineFeeParams
} from '../../model/property/report/queryDeadlineFeeModel'

const ApiPrefix = {
  FindQueryDeadlineFee: '/report/queryDeadlineFee'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryDeadlineFee = (
  params: QueryDeadlineFeeParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryDeadlineFeeReply>({
      url: ApiPrefix.FindQueryDeadlineFee,
      params
    })
    .then(res => res.data)
}
