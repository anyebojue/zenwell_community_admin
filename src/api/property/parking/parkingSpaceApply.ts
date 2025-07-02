import { request } from 'utils/request/axios'
import {
  FindParkingSpaceApplyReply,
  ParkingSpaceApplyParams
} from '../../model/property/parking/parkingSpaceApplyModel'

const ApiPrefix = {
  FindParkingSpaceApply: '/car/parking_space_apply',
  CreateParkingSpaceApply: '/car/parking_space_apply',
  UpdateParkingSpaceApply: '/car/parking_space_apply',
  DeleteParkingSpaceApply: '/car/parking_space_apply'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindParkingSpaceApply = (
  params: ParkingSpaceApplyParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindParkingSpaceApplyReply>({
      url: ApiPrefix.FindParkingSpaceApply,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateParkingSpaceApply = (data: ParkingSpaceApplyParams) => {
  return request
    .post({
      url: ApiPrefix.CreateParkingSpaceApply,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateParkingSpaceApply = (data: ParkingSpaceApplyParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateParkingSpaceApply}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteParkingSpaceApply = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteParkingSpaceApply}/${ids.join(',')}`
    })
    .then(res => res.data)
}
