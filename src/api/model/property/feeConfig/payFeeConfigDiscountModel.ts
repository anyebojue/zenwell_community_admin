import { Page } from '../../pageModel'
import { FeeConfigReply } from './feeConfigModel'
import { FeeDiscountReply } from './feeDiscountModel'

export interface PayFeeConfigDiscountReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string //
  configId?: string // 费用项ID
  discountId?: string // 折扣ID
  communityId?: string // 分片小区ID
  statusCd?: string // 数据状态
  paymaxEndTime?: string // 折扣终止时间
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  status?: number // Status, 1: Active, 0: Inactive
  remark?: string // 备注
  feeConfig?: FeeConfigReply
  feeDiscount?: FeeDiscountReply
}

export interface PayFeeConfigDiscountParams {
  id?: string
  name?: string
  configId?: string
  discountId?: string
  communityId?: string
  statusCd?: string
  paymaxEndTime?: string
  startTime?: string
  endTime?: string
  status?: number
  remark?: string
}

export interface FindPayFeeConfigDiscountReply {
  page: Page
  list: Array<PayFeeConfigDiscountReply>
}
