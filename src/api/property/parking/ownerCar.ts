import { request } from 'utils/request/axios'
import { FindOwnerCarReply, OwnerCarParams } from '../../model/property/parking/ownerCarModel'

const ApiPrefix = {
  FindOwnerCar: '/car/owner_car',
  CreateOwnerCar: '/car/owner_car',
  UpdateOwnerCar: '/car/owner_car',
  DeleteOwnerCar: '/car/owner_car'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindOwnerCar = (
  params: OwnerCarParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindOwnerCarReply>({
      url: ApiPrefix.FindOwnerCar,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateOwnerCar = (data: OwnerCarParams) => {
  return request
    .post({
      url: ApiPrefix.CreateOwnerCar,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateOwnerCar = (data: OwnerCarParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateOwnerCar}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteOwnerCar = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteOwnerCar}/${ids.join(',')}`
    })
    .then(res => res.data)
}
