import { request } from 'utils/request/axios'
import {
  FindQueryHuaningOweFeeDetailReply,
  QueryHuaningOweFeeDetailReply
} from '../../model/property/report/queryHuaningOweFeeDetailModel'

const ApiPrefix = {
  FindQueryHuaningOweFeeDetail: '/report/queryHuaningOweFeeDetail'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryHuaningOweFeeDetail = (
  params: QueryHuaningOweFeeDetailReply & PaginationParams
) => {
  return request
    .get<FindQueryHuaningOweFeeDetailReply>({
      url: ApiPrefix.FindQueryHuaningOweFeeDetail,
      params
    })
    .then(res => res.data)
}
