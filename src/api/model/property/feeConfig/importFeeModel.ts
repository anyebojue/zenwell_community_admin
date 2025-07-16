import { Page } from '../../pageModel'

export interface ImportFeeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  feeTypeCd?: string
  communityId?: string
  statusCd?: string
  remark?: string
  name?: string
  feeFlag?: string
  paymentCycle?: string
  paymentCd?: string
  floorId?: string
  floorNum?: string
  unitId?: string
  unitNum?: string
  layer?: string
  deductFrom?: string
  computingFormula?: string
  startTime?: string
  endTime?: string
  payerObjType?: string
}

export interface ImportFeeParams {
  id?: string
  feeTypeCd?: string
  communityId?: string
  statusCd?: string
  remark?: string
  name?: string
  feeFlag?: string
  paymentCycle?: string
  paymentCd?: string
  floorId?: string
  floorNum?: string
  unitId?: string
  unitNum?: string
  layer?: string
  deductFrom?: string
  computingFormula?: string
  startTime?: string
  endTime?: string
  payerObjType?: string
}

export interface FindImportFeeReply {
  page: Page
  list: Array<ImportFeeReply>
}
