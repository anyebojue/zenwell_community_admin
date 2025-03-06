import { request } from 'utils/request/axios'
import {
  FindQueryNoFeeRoomsReply,
  QueryNoFeeRoomsParams
} from '../../model/property/report/queryNoFeeRoomsModel'

const ApiPrefix = {
  FindQueryNoFeeRooms: '/report/queryNoFeeRooms'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindQueryNoFeeRooms = (
  params: QueryNoFeeRoomsParams & PaginationParams & { isExport?: boolean }
) => {
  return request
    .get<FindQueryNoFeeRoomsReply>({
      url: ApiPrefix.FindQueryNoFeeRooms,
      params
    })
    .then(res => res.data)
}
