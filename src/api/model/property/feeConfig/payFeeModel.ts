import { Page } from '../../pageModel'
import { FeeConfigReply } from './feeConfigModel'
import { MeterWaterReply } from './meterWaterModel'
import { PayFeeDetailReply } from './payFeeDetailModel'

export interface PayFeeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  consumption?: string
  feeTypeCd?: string
  communityId?: string
  payerObjId?: string
  objName?: string
  incomeObjId?: string
  startTime?: string
  endTime?: string
  amount?: 0
  userId?: string
  statusCd?: string
  feeFlag?: string
  feeId?: string
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
  payFeeDetail?: PayFeeDetailReply
  meterWater?: MeterWaterReply
}

export interface PayFeeParams {
  id?: string
  feeTypeCd?: string
  communityId?: string
  payerObjId?: string
  objName?: string
  incomeObjId?: string
  startTime?: string
  endTime?: string
  amount?: number
  userId?: string
  statusCd?: string
  feeFlag?: string
  feeId?: string
  configId?: string
  payerObjType?: string
  batchId?: string
  status?: 1
  remark?: string
  meterType?: string
  meterWater?: {
    meterType?: string
    preDegrees?: string
    curDegrees?: string
    preReadingTime?: string
    curReadingTime?: string
  }
}

export interface FindPayFeeReply {
  page: Page
  list: Array<PayFeeReply>
}
