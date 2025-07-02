import { Page } from '../../pageModel'
import { FeeDiscountRuleSpecReply } from './feeDiscountRuleSpecModel'

export interface FeeDiscountReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string // 小区ID
  discountType?: string // 类型 1001 优惠  2002 违约  3003 优惠(需要申请)
  ruleId?: string // 规则ID
  discountDesc?: string // 打折说明
  name?: string // 打折名称
  status?: number // Status, 1: Active, 0: Inactive
  remark?: string // 备注
  feeDiscountSpec?: {
    id?: string
    createdAt?: string
    updatedAt?: string
    discountId?: string
    communityId?: string
    specId?: string
    name?: string
    specValue?: string
    status?: 1
    remark?: string
    feeDiscountRuleSpec?: FeeDiscountRuleSpecReply
  }[]
}

export interface FeeDiscountParams {
  id?: string
  communityId?: string // 小区ID
  discountType?: string // 类型 1001 优惠  2002 违约  3003 优惠(需要申请)
  ruleId?: string // 规则ID
  discountDesc?: string // 打折说明
  name?: string // 打折名称
  status?: number // Status, 1: Active, 0: Inactive
  remark?: string // 备注
  feeDiscountSpec?: {
    communityId?: string
    specId?: string
    name?: string
    specValue?: string
    status?: number
    remark?: string
  }[]
}

export interface FindFeeDiscountReply {
  page: Page
  list: Array<FeeDiscountReply>
}
