import { request } from 'utils/request/axios'
import {
  FindQueryReportFeeDetailOwnerReply,
  QueryReportFeeDetailOwnerParams
} from '../../model/property/report/queryReportFeeDetailOwnerModel'

const ApiPrefix = {
  FindQueryReportFeeDetailOwner: '/report/queryReportFeeDetailOwner'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryReportFeeDetailOwner = (
  params: QueryReportFeeDetailOwnerParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryReportFeeDetailOwnerReply>({
      url: ApiPrefix.FindQueryReportFeeDetailOwner,
      params
    })
    .then(res => res.data)
}
