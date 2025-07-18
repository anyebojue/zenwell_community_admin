import { request } from 'utils/request/axios'
import {
  FindChargeMonthOrderReply,
  ChargeMonthOrderParams
} from '../../model/property/parking/chargeMonthOrderModel'

const ApiPrefix = {
  FindChargeMonthOrder: '/car/charge_month_order',
  CreateChargeMonthOrder: '/car/charge_month_order',
  UpdateChargeMonthOrder: '/car/charge_month_order',
  DeleteChargeMonthOrder: '/car/charge_month_order'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindChargeMonthOrder = (
  params: ChargeMonthOrderParams & PaginationParams & { is_export?: boolean }
) => {
  return request
    .get<FindChargeMonthOrderReply>({
      url: ApiPrefix.FindChargeMonthOrder,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateChargeMonthOrder = (data: ChargeMonthOrderParams) => {
  return request
    .post({
      url: ApiPrefix.CreateChargeMonthOrder,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateChargeMonthOrder = (data: ChargeMonthOrderParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateChargeMonthOrder}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteChargeMonthOrder = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteChargeMonthOrder}/${ids.join(',')}`
    })
    .then(res => res.data)
}
