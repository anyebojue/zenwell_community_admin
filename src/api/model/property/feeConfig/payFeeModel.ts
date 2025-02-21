import { Page } from '../../pageModel'
import { FeeConfigReply } from './feeConfigModel'

export interface PayFeeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  feeTypeCd?: string
  communityId?: string
  payerObjId?: string
  incomeObjId?: string
  startTime?: string
  endTime?: string
  amount?: 0
  userId?: string
  statusCd?: string
  feeFlag?: string
  configId?: string
  payerObjType?: string
  batchId?: string
  status?: 1
  remark?: string
  payerObjName?: string // 付款方
  incomeObjName?: string // 收款方
  computeAccount?: {
    receivableAmount?: string
    payableAmount?: string
  }
  feeConfig?: FeeConfigReply
}

export interface PayFeeParams {
  id?: string
  feeTypeCd?: string
  communityId?: string
  payerObjId?: string
  incomeObjId?: string
  startTime?: string
  endTime?: string
  amount?: 0
  userId?: string
  statusCd?: string
  feeFlag?: string
  configId?: string
  payerObjType?: string
  batchId?: string
  status?: 1
  remark?: string
}

export interface FindPayFeeReply {
  page: Page
  list: Array<PayFeeReply>
}
