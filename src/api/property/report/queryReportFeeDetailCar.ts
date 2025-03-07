import { request } from 'utils/request/axios'
import {
  FindQueryReportFeeDetailCarReply,
  QueryReportFeeDetailCarParams
} from '../../model/property/report/queryReportFeeDetailCarModel'

const ApiPrefix = {
  FindQueryReportFeeDetailCar: '/report/queryReportFeeDetailCar'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryReportFeeDetailCar = (
  params: QueryReportFeeDetailCarParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryReportFeeDetailCarReply>({
      url: ApiPrefix.FindQueryReportFeeDetailCar,
      params
    })
    .then(res => res.data)
}
