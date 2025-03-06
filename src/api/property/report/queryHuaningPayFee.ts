import { request } from 'utils/request/axios'
import {
  FindQueryHuaningPayFeeReply,
  QueryHuaningPayFeeParams
} from '../../model/property/report/queryHuaningPayFeeModel'

const ApiPrefix = {
  FindQueryHuaningPayFee: '/report/queryHuaningPayFee'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryHuaningPayFee = (params: QueryHuaningPayFeeParams) => {
  return request
    .get<FindQueryHuaningPayFeeReply>({
      url: ApiPrefix.FindQueryHuaningPayFee,
      params
    })
    .then(res => res.data)
}
