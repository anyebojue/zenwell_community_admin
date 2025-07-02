import { request } from 'utils/request/axios'
import {
  FindQueryReportFeeDetailRoomReply,
  QueryReportFeeDetailRoomParams
} from '../../model/property/report/queryReportFeeDetailRoomModel'

const ApiPrefix = {
  FindQueryReportFeeDetailRoom: '/report/queryReportFeeDetailRoom'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryReportFeeDetailRoom = (
  params: QueryReportFeeDetailRoomParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryReportFeeDetailRoomReply>({
      url: ApiPrefix.FindQueryReportFeeDetailRoom,
      params
    })
    .then(res => res.data)
}
