import { request } from 'utils/request/axios'
import {
  FindRoomRenovationRecordReply,
  RoomRenovationRecordParams
} from '../../model/property/communitys/roomRenovationRecordModel'

const ApiPrefix = {
  FindRoomRenovationRecord: '/auth/room_renovation_record',
  CreateRoomRenovationRecord: '/auth/room_renovation_record',
  UpdateRoomRenovationRecord: '/auth/room_renovation_record',
  DeleteRoomRenovationRecord: '/auth/room_renovation_record'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindRoomRenovationRecord = (params: RoomRenovationRecordParams & PaginationParams) => {
  return request
    .get<FindRoomRenovationRecordReply>({
      url: ApiPrefix.FindRoomRenovationRecord,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateRoomRenovationRecord = (data: RoomRenovationRecordParams) => {
  return request
    .post({
      url: ApiPrefix.CreateRoomRenovationRecord,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateRoomRenovationRecord = (data: RoomRenovationRecordParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateRoomRenovationRecord}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteRoomRenovationRecord = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteRoomRenovationRecord}/${ids.join(',')}`
    })
    .then(res => res.data)
}
