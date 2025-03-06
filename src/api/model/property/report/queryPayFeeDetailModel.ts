import { Page } from '../../pageModel'

export interface SumTotal {
  allDeductionAmount?: string
  allGiftAmount?: string
  allLateFee?: string
  allPreferentialAmount?: string
  allReceivableAmount?: string
  allReceivedAmount?: string
  totalDeductionAmount?: string
  totalLateFee?: string
  totalPreferentialAmount?: string
  totalReceivableAmount?: string
  totalReceivedAmount?: string
  totalGiftAmount?: string
  page?: string
  records?: string
  row?: string
  total?: string
}

export interface QueryPayFeeDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  acctAmount?: string
  allHisOweReceivedAmount?: string
  builtUpArea?: string
  cashierId?: string
  cashierName?: string
  configReceivedAmount?: string
  createTime?: string
  curReceivableAmount?: string
  curReceivedAmount?: string
  deductionAmount?: string
  detailId?: string
  discountAmount?: string
  endTime?: string
  feeFlag?: string
  feeId?: string
  feeName?: string
  feeTypeCd?: string
  feeTypeCdName?: string
  giftAmount?: string
  hisOweAmount?: string
  hisOweReceivedAmount?: string
  lateAmount?: string
  lateFee?: string
  oId?: string
  oweDay?: string
  ownerName?: string
  page?: string
  payableAmount?: string
  payerObjId?: string
  payerObjName?: string
  payerObjType?: string
  preReceivedAmount?: string
  preferentialAmount?: string
  primeRate?: string
  receivableAmount?: string
  receivedAmount?: string
  records?: string
  remark?: string
  row?: string
  startTime?: string
  state?: string
  stateName?: string
  statusCd?: string
  total?: string
  withholdAmount?: string
}

export interface QueryPayFeeDetailParams {
  id?: string
  communityId?: string
  isExport?: string
  feeStartTime?: string
  feeEndTime?: string
  startTime?: string
  endTime?: string
  feeTypeCd?: string
  state?: string
  primeRate?: string
  configId?: string
  floorId?: string
  payerObjName?: string
  roomNum?: string
}

export interface FindQueryPayFeeDetailReply {
  page: Page
  list: Array<QueryPayFeeDetailReply>
  exportUrl: string
  sumTotal: SumTotal
}
