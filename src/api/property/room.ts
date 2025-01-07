import { request } from 'utils/request/axios'
import { FindRoomReply, RoomParams } from '../model/property/roomModel'

const ApiPrefix = {
  ImportRoom: '/auth/file/uploads_room',
  FindRoom: '/auth/room',
  CreateRoom: '/auth/room',
  UpdateRoom: '/auth/room',
  DeleteRoom: '/auth/room'
}

/**
 * 导入房产
 * @param data
 * @returns
 */
export const ImportRoom = (data: FormData) => {
  return request
    .post({
      url: ApiPrefix.ImportRoom,
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => res.data)
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindRoom = (params: RoomParams & PaginationParams) => {
  return request
    .get<FindRoomReply>({
      url: ApiPrefix.FindRoom,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateRoom = (data: RoomParams) => {
  return request
    .post({
      url: ApiPrefix.CreateRoom,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateRoom = (data: RoomParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateRoom}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteRoom = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteRoom}/${ids.join(',')}`
    })
    .then(res => res.data)
}
