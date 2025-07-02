import { request } from 'utils/request/axios'
import {
  FindQueryRepairReply,
  QueryRepairParams,
  Rep,
  SumTotal
} from '../../model/property/report/queryRepairModel'

const ApiPrefix = {
  FindQueryRepair: '/report/queryRepair'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryRepair = (
  params: QueryRepairParams &
    PaginationParams & { exportUrl?: boolean; rep?: Rep; sumTotal?: SumTotal }
) => {
  return request
    .get<FindQueryRepairReply>({
      url: ApiPrefix.FindQueryRepair,
      params
    })
    .then(res => res.data)
}
