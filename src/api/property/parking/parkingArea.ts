import { request } from 'utils/request/axios'
import {
  FindParkingAreaReply,
  ParkingAreaParams
} from '../../model/property/parking/parkingAreaModel'

const ApiPrefix = {
  FindParkingArea: '/car/parking_area',
  CreateParkingArea: '/car/parking_area',
  UpdateParkingArea: '/car/parking_area',
  DeleteParkingArea: '/car/parking_area'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindParkingArea = (
  params: ParkingAreaParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindParkingAreaReply>({
      url: ApiPrefix.FindParkingArea,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateParkingArea = (data: ParkingAreaParams) => {
  return request
    .post({
      url: ApiPrefix.CreateParkingArea,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateParkingArea = (data: ParkingAreaParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateParkingArea}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteParkingArea = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteParkingArea}/${ids.join(',')}`
    })
    .then(res => res.data)
}
