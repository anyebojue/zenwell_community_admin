import { request } from 'utils/request/axios'
import {
  FindFeeDiscountRuleReply,
  FeeDiscountRuleParams
} from '../../model/property/feeConfig/feeDiscountRuleModel'

const ApiPrefix = {
  FindFeeDiscountRule: '/fee/fee_discount_rule',
  CreateFeeDiscountRule: '/fee/fee_discount_rule',
  UpdateFeeDiscountRule: '/fee/fee_discount_rule',
  DeleteFeeDiscountRule: '/fee/fee_discount_rule'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeDiscountRule = (params: FeeDiscountRuleParams & PaginationParams) => {
  return request
    .get<FindFeeDiscountRuleReply>({
      url: ApiPrefix.FindFeeDiscountRule,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeDiscountRule = (data: FeeDiscountRuleParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeDiscountRule,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeDiscountRule = (data: FeeDiscountRuleParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeDiscountRule}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeDiscountRule = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeDiscountRule}/${ids.join(',')}`
    })
    .then(res => res.data)
}
