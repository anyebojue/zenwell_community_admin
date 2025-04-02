import { request } from 'utils/request/axios'
import {
  FindChargeMonthCardReply,
  ChargeMonthCardParams
} from '../../model/property/parking/chargeMonthCardModel'

const ApiPrefix = {
  FindChargeMonthCard: '/car/charge_month_card',
  CreateChargeMonthCard: '/car/charge_month_card',
  UpdateChargeMonthCard: '/car/charge_month_card',
  DeleteChargeMonthCard: '/car/charge_month_card'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindChargeMonthCard = (params: ChargeMonthCardParams & PaginationParams) => {
  return request
    .get<FindChargeMonthCardReply>({
      url: ApiPrefix.FindChargeMonthCard,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateChargeMonthCard = (data: ChargeMonthCardParams) => {
  return request
    .post({
      url: ApiPrefix.CreateChargeMonthCard,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateChargeMonthCard = (data: ChargeMonthCardParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateChargeMonthCard}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteChargeMonthCard = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteChargeMonthCard}/${ids.join(',')}`
    })
    .then(res => res.data)
}
