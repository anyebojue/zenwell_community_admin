import { request } from 'utils/request/axios'
import {
  FindQueryReportFeeDetailContractReply,
  QueryReportFeeDetailContractParams
} from '../../model/property/report/queryReportFeeDetailContractModel'

const ApiPrefix = {
  FindQueryReportFeeDetailContract: '/report/queryReportFeeDetailContract'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryReportFeeDetailContract = (
  params: QueryReportFeeDetailContractParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryReportFeeDetailContractReply>({
      url: ApiPrefix.FindQueryReportFeeDetailContract,
      params
    })
    .then(res => res.data)
}
