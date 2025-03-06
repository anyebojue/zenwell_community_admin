import { Page } from '../../pageModel'
import { PayFeeDetailReply } from './payFeeDetailModel'

export interface ReturnPayFeeReply {
  id: string
  createdAt?: string
  updatedAt?: string
  communityId?: string // 小区id
  configId?: string // 费用项id
  feeId?: string // 费用id
  feeTypeCd?: string // 费用类型
  detailId?: string // 缴费id
  cycles?: number // 周期
  receivableAmount?: number // 应收金额
  receivedAmount?: number // 实收金额
  primeRate?: number // 打折率
  stateCd?: string // 审核状态：1000待审核1001审核通过10002审核不通过
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  payTime?: string // 缴费时间
  reason?: string // 退费原因
  applyPersonId?: string // 申请人ID
  applyPersonName?: string // 申请人
  auditPersonId?: string // 审核人ID
  auditPersonName?: string // 审核人
  status?: number // Status, 1: Active, 0: Inactive
  remark?: string // 备注
  payFeeDetail?: PayFeeDetailReply
  createTime?: string
  startTime?: string
  endTime?: string
  payerObjId?: string
  payerObjName?: string
}

export interface ReturnPayFeeParams {
  id?: string
  communityId?: string // 小区id
  configId?: string // 费用项id
  feeId?: string // 费用id
  feeTypeCd?: string // 费用类型
  detailId?: string // 缴费id
  cycles?: number // 周期
  receivableAmount?: number // 应收金额
  receivedAmount?: number // 实收金额
  primeRate?: number // 打折率
  stateCd?: string // 审核状态：1000待审核1001审核通过10002审核不通过
  statusCd?: string // 数据状态，详细参考c_status表，S 保存，0, 在用 1失效
  payTime?: string // 缴费时间
  reason?: string // 退费原因
  applyPersonId?: string // 申请人ID
  applyPersonName?: string // 申请人
  auditPersonId?: string // 审核人ID
  auditPersonName?: string // 审核人
  status?: number // Status, 1: Active, 0: Inactive
  remark?: string // 备注
  payerObjId?: string
  startTime?: string
  endTime?: string
}

export interface FindReturnPayFeeReply {
  list: ReturnPayFeeReply[]
  page: Page
  exportUrl: string
}
