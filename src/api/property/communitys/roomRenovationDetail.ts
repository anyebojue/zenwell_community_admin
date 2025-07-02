import { request } from 'utils/request/axios'
import {
  FindRoomRenovationDetailReply,
  RoomRenovationDetailParams
} from '../../model/property/communitys/roomRenovationDetailModel'

const ApiPrefix = {
  FindRoomRenovationDetail: '/auth/room_renovation_detail',
  CreateRoomRenovationDetail: '/auth/room_renovation_detail',
  UpdateRoomRenovationDetail: '/auth/room_renovation_detail',
  DeleteRoomRenovationDetail: '/auth/room_renovation_detail'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindRoomRenovationDetail = (params: RoomRenovationDetailParams & PaginationParams) => {
  return request
    .get<FindRoomRenovationDetailReply>({
      url: ApiPrefix.FindRoomRenovationDetail,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateRoomRenovationDetail = (data: RoomRenovationDetailParams) => {
  return request
    .post({
      url: ApiPrefix.CreateRoomRenovationDetail,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateRoomRenovationDetail = (data: RoomRenovationDetailParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateRoomRenovationDetail}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteRoomRenovationDetail = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteRoomRenovationDetail}/${ids.join(',')}`
    })
    .then(res => res.data)
}
