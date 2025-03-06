import { request } from 'utils/request/axios'
import {
  FindQueryHuaningOweFeeReply,
  QueryHuaningOweFeeParams
} from '../../model/property/report/queryHuaningOweFeeModel'

const ApiPrefix = {
  FindQueryHuaningOweFee: '/report/queryHuaningOweFee'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryHuaningOweFee = (params: QueryHuaningOweFeeParams & PaginationParams) => {
  return request
    .get<FindQueryHuaningOweFeeReply>({
      url: ApiPrefix.FindQueryHuaningOweFee,
      params
    })
    .then(res => res.data)
}
