import { Page } from '../../pageModel'
import { FeeDiscountRuleReply } from './feeDiscountRuleModel'

export interface FeeDiscountRuleSpecReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  ruleId?: string
  name?: string
  status?: number
  remark?: string
  feeDiscountRule: FeeDiscountRuleReply
}

export interface FeeDiscountRuleSpecParams {
  id?: string
  ruleId?: string
  name?: string
  status?: number
  remark?: string
}

export interface FindFeeDiscountRuleSpecReply {
  page: Page
  list: Array<FeeDiscountRuleSpecReply>
}
