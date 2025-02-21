import { Page } from '../../pageModel'
import { PayFeeReply } from './payFeeModel'

export interface PayFeeDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  feeId?: string // 费用ID
  communityId?: string // 小区ID
  cycles?: number // 周期，以月为单位
  receivableAmount?: number // 应收金额
  receivedAmount?: number // 应收金额
  primeRate?: number // 支付方式
  statusCd?: string // 用于退费状态参考字典表
  startTime?: string // 费用开始时间
  endTime?: string // 费用结束时间
  payableAmount?: number // 应缴金额
  payOrderId?: number // 支付订单ID
  cashierId?: string // 收银员ID，员工ID
  cashierName?: string // 收银员,员工
  openInvoice?: string // 是否开票 Y 已开票 N 未开票
  acctAmount?: number // 账户抵扣金额
  discountAmount?: number // 优惠打折金额
  deductionAmount?: number // 优惠减免金额
  lateAmount?: number // 滞纳金
  giftAmount?: number // 赠送金额
  status?: number // Status, 1: Active, 0: Inactive
  remark?: string // 备注
  payFee?: PayFeeReply
}

export interface PayFeeDetailParams {
  id?: string
  feeId?: string // 费用ID
  communityId?: string // 小区ID
  cycles?: number // 周期，以月为单位
  receivableAmount?: number // 应收金额
  receivedAmount?: number // 应收金额
  primeRate?: number // 支付方式
  statusCd?: string // 用于退费状态参考字典表
  startTime?: string // 费用开始时间
  endTime?: string // 费用结束时间
  payableAmount?: number // 应缴金额
  payOrderId?: number // 支付订单ID
  cashierId?: string // 收银员ID，员工ID
  cashierName?: string // 收银员,员工
  openInvoice?: string // 是否开票 Y 已开票 N 未开票
  acctAmount?: number // 账户抵扣金额
  discountAmount?: number // 优惠打折金额
  deductionAmount?: number // 优惠减免金额
  lateAmount?: number // 滞纳金
  giftAmount?: number // 赠送金额
  status?: number // Status, 1: Active, 0: Inactive
  remark?: string // 备注
}

export interface FindPayFeeDetailReply {
  page: Page
  list: Array<PayFeeDetailReply>
}
