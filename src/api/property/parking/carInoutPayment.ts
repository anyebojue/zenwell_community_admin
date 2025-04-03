import { request } from 'utils/request/axios'
import {
  FindCarInoutPaymentReply,
  CarInoutPaymentParams
} from '../../model/property/parking/carInoutPaymentModel'

const ApiPrefix = {
  FindCarInoutPayment: '/car/car_inout_payment',
  CreateCarInoutPayment: '/car/car_inout_payment',
  UpdateCarInoutPayment: '/car/car_inout_payment',
  DeleteCarInoutPayment: '/car/car_inout_payment'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindCarInoutPayment = (
  params: CarInoutPaymentParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindCarInoutPaymentReply>({
      url: ApiPrefix.FindCarInoutPayment,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateCarInoutPayment = (data: CarInoutPaymentParams) => {
  return request
    .post({
      url: ApiPrefix.CreateCarInoutPayment,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateCarInoutPayment = (data: CarInoutPaymentParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateCarInoutPayment}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteCarInoutPayment = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteCarInoutPayment}/${ids.join(',')}`
    })
    .then(res => res.data)
}
