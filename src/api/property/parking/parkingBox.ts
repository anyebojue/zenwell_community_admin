import { request } from 'utils/request/axios'
import { FindParkingBoxReply, ParkingBoxParams } from '../../model/property/parking/parkingBoxModel'

const ApiPrefix = {
  FindParkingBox: '/car/parking_box',
  CreateParkingBox: '/car/parking_box',
  UpdateParkingBox: '/car/parking_box',
  DeleteParkingBox: '/car/parking_box'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindParkingBox = (
  params: ParkingBoxParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindParkingBoxReply>({
      url: ApiPrefix.FindParkingBox,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateParkingBox = (data: ParkingBoxParams) => {
  return request
    .post({
      url: ApiPrefix.CreateParkingBox,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateParkingBox = (data: ParkingBoxParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateParkingBox}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteParkingBox = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteParkingBox}/${ids.join(',')}`
    })
    .then(res => res.data)
}
