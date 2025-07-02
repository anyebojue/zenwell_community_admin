import { request } from 'utils/request/axios'
import {
  FindFeeDiscountRuleSpecReply,
  FeeDiscountRuleSpecParams
} from '../../model/property/feeConfig/feeDiscountRuleSpecModel'

const ApiPrefix = {
  FindFeeDiscountRuleSpec: '/fee/fee_discount_rule_spec',
  CreateFeeDiscountRuleSpec: '/fee/fee_discount_rule_spec',
  UpdateFeeDiscountRuleSpec: '/fee/fee_discount_rule_spec',
  DeleteFeeDiscountRuleSpec: '/fee/fee_discount_rule_spec'
}

/**
 * 查询接口
 * @param params
 * @returns
 */
export const FindFeeDiscountRuleSpec = (params: FeeDiscountRuleSpecParams & PaginationParams) => {
  return request
    .get<FindFeeDiscountRuleSpecReply>({
      url: ApiPrefix.FindFeeDiscountRuleSpec,
      params
    })
    .then(res => res.data)
}

/**
 * 新增接口
 * @param data
 * @returns
 */
export const CreateFeeDiscountRuleSpec = (data: FeeDiscountRuleSpecParams) => {
  return request
    .post({
      url: ApiPrefix.CreateFeeDiscountRuleSpec,
      data
    })
    .then(res => res.data)
}

/**
 * 修改接口
 * @param data
 * @returns
 */
export const UpdateFeeDiscountRuleSpec = (data: FeeDiscountRuleSpecParams) => {
  return request
    .patch({
      url: `${ApiPrefix.UpdateFeeDiscountRuleSpec}/${data.id}`,
      data
    })
    .then(res => res.data)
}

/**
 * 删除接口
 * @param ids
 * @returns
 */
export const DeleteFeeDiscountRuleSpec = (ids: string[]) => {
  return request
    .delete({
      url: `${ApiPrefix.DeleteFeeDiscountRuleSpec}/${ids.join(',')}`
    })
    .then(res => res.data)
}
