import { request } from 'utils/request/axios'
import {
  FindRoomRenovationReply,
  RoomRenovationParams
} from '../model/property/roomRenovationModel'

const ApiPrefix = {
  FindRoomRenovation: '/auth/room_renovation',
  CreateRoomRenovation: '/auth/room_renovation',
  UpdateRoomRenovation: '/auth/room_renovation',
  DeleteRoomRenovation: '/auth/room_renovation'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindRoomRenovation = (params: RoomRenovationParams & PaginationParams) => {
  return request
    .get<FindRoomRenovationReply>({
      url: ApiPrefix.FindRoomRenovation,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateRoomRenovation = (data: RoomRenovationParams) => {
  return request
    .post({
      url: ApiPrefix.CreateRoomRenovation,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateRoomRenovation = (data: RoomRenovationParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateRoomRenovation}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteRoomRenovation = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteRoomRenovation}/${ids.join(',')}`
    })
    .then(res => res.data)
}
