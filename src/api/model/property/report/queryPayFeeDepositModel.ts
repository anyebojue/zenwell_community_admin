import { Page } from '../../pageModel'
import { FeeConfigTypeReply } from '../feeConfig/feeConfigTypeModel'

export interface SumTotal {
  paidfeeAmount?: string
  paidfeeAmounts?: string
  refundFailedAmount?: string
  refundFailedAmounts?: string
  refundInProgressAmount?: string
  refundInProgressAmounts?: string
  refundedAmount?: string
  refundedAmounts?: string
  unpaidfeeAmount?: string
  unpaidfeeAmounts?: string
}

export interface FeeConfigDto {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
  communityId?: string
  feeTypeCd?: string
  squarePrice?: string
  additionalAmount?: string
  statusCd?: string
  isDefault?: string
  startTime?: string
  endTime?: string
  feeFlag?: string
  feeName?: string
  computingFormula?: string
  billType?: string
  paymentCycle?: string
  paymentCd?: string
  computingFormulaText?: string
  deductFrom?: string
  payOnline?: string
  scale?: string
  decimalPlace?: number
  units?: string
  prepaymentPeriod?: string
  status?: number
  remark?: string
  feeConfigType?: FeeConfigTypeReply
}

export interface ReportFeeYearCollectionDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  additionalAmount?: string
  amount?: string
  bId?: string
  billType?: string
  billTypeName?: string
  communityId?: string
  computingFormula?: string
  computingFormulaText?: string
  configEndTime?: string
  configId?: string
  configStartTime?: string
  createTime?: string
  deadlineTime?: string
  endTime?: string
  feeFlag?: string
  feeFlagName?: string
  feeId?: string
  feeName?: string
  feeTypeCd?: string
  feeTypeCdName?: string
  floorNum?: string
  incomeObjId?: string
  isDefault?: string
  objName?: string
  ownerName?: string
  page?: number
  payerObjId?: string
  payerObjType?: string
  payerObjTypeName?: string
  paymentCd?: string
  paymentCycle?: string
  records?: number
  roomNum?: string
  row?: number
  squarePrice?: string
  startTime?: string
  state?: string
  stateName?: string
  statusCd?: string
  total?: number
  unitNum?: string
  userId?: string
  feeConfigDtos?: Array<FeeConfigDto>
}

export interface ReportFeeYearCollectionDetailParams {
  id?: string
  communityId?: string
  isExport?: boolean
  floorId?: string
  floorName?: string
  roomNum?: string
  unitId?: string
  feeId?: string
  state?: string
  payerObjType?: string
  startTime?: string
  endTime?: string
  configId?: string
  detailState?: string
  feeTypeCd?: string
}

export interface FindReportFeeYearCollectionDetailReply {
  page: Page
  list: Array<ReportFeeYearCollectionDetailReply>
  exportUrl: string
  sumTotal: SumTotal
}
