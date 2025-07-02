import { request } from 'utils/request/axios'
import {
  FindParkingSpaceInfoReply,
  ParkingSpaceInfoParams
} from '../../model/property/parking/parkingSpaceInfoModel'

const ApiPrefix = {
  FindParkingSpaceInfo: '/car/parking_space_info',
  CreateParkingSpaceInfo: '/car/parking_space_info',
  UpdateParkingSpaceInfo: '/car/parking_space_info',
  DeleteParkingSpaceInfo: '/car/parking_space_info',
  BatchCreateParkingSpaceInfo: '/car/parking_space_info_batch'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindParkingSpaceInfo = (
  params: ParkingSpaceInfoParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindParkingSpaceInfoReply>({
      url: ApiPrefix.FindParkingSpaceInfo,
      params
    })
    .then(res => res.data)
}

/**
 * 批量新增接口
 * @param data
 * @returns
 */
export const BatchCreateParkingSpaceInfo = (data: {
  preNum: string
  startNum: string
  endNum: string
  paId: string
  parkingType: string
  communityId: string
}) => {
  return request
    .post({
      url: ApiPrefix.BatchCreateParkingSpaceInfo,
      data
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateParkingSpaceInfo = (data: ParkingSpaceInfoParams) => {
  return request
    .post({
      url: ApiPrefix.CreateParkingSpaceInfo,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateParkingSpaceInfo = (data: ParkingSpaceInfoParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateParkingSpaceInfo}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteParkingSpaceInfo = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteParkingSpaceInfo}/${ids.join(',')}`
    })
    .then(res => res.data)
}
