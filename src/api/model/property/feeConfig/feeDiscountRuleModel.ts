import { Page } from '../../pageModel'

export interface FeeDiscountRuleReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  discountType?: string
  discountSmallType?: string
  name?: string
  status?: number
  remark?: string
}

export interface FeeDiscountRuleParams {
  id?: string
  discountType?: string
  discountSmallType?: string
  name?: string
  status?: number
  remark?: string
}

export interface FindFeeDiscountRuleReply {
  page: Page
  list: Array<FeeDiscountRuleReply>
}
