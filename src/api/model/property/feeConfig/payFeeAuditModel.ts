import { Page } from '../../pageModel'
import { PayFeeDetailReply } from './payFeeDetailModel'

export interface PayFeeAuditReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  feeId?: string // 费用ID
  communityId?: string // 小区ID
  feeDetailId?: string // 消费ID
  stateCd?: string // 审核状态 1010 待审核 2020 审核通过 3030 未审核
  message?: string // 审核意见
  auditUserId?: string // 审核人ID
  auditUserName?: string // 审核人名称
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  payFeeDetail?: PayFeeDetailReply
}

export interface PayFeeAuditParams {
  id?: string
  feeId?: string // 费用ID
  communityId?: string // 小区ID
  feeDetailId?: string // 消费ID
  stateCd?: string // 审核状态 1010 待审核 2020 审核通过 3030 未审核
  message?: string // 审核意见
  auditUserId?: string // 审核人ID
  auditUserName?: string // 审核人名称
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
}

export interface FindPayFeeAuditReply {
  page: Page
  list: Array<PayFeeAuditReply>
}
