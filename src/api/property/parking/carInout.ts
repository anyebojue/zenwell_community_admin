import { request } from 'utils/request/axios'
import { FindCarInoutReply, CarInoutParams } from '../../model/property/parking/carInoutModel'

const ApiPrefix = {
  FindCarInout: '/car/car_inout',
  CreateCarInout: '/car/car_inout',
  UpdateCarInout: '/car/car_inout',
  DeleteCarInout: '/car/car_inout'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindCarInout = (
  params: CarInoutParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindCarInoutReply>({
      url: ApiPrefix.FindCarInout,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateCarInout = (data: CarInoutParams) => {
  return request
    .post({
      url: ApiPrefix.CreateCarInout,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateCarInout = (data: CarInoutParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateCarInout}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteCarInout = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteCarInout}/${ids.join(',')}`
    })
    .then(res => res.data)
}
