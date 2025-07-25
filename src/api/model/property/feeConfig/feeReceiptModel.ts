import { Page } from '../../pageModel'
import { FeeReceiptDetailReply } from './feeReceiptDetailModel'

export interface FeeReceiptReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string
  objType?: string
  objId?: string
  objName?: string
  amount?: number
  statusCd?: string
  remark?: string
  payObjId?: string
  payObjName?: string
  startTime?: string
  endTime?: string
  feeReceiptDetail?: FeeReceiptDetailReply
}

export interface FeeReceiptParams {
  id?: string
  communityId?: string
  objType?: string
  objId?: string
  objName?: string
  amount?: number
  statusCd?: string
  remark?: string
  payObjId?: string
  payObjName?: string
  startTime?: string
  endTime?: string
  payerObjName?: string
}

export interface FindFeeReceiptReply {
  page: Page
  list: Array<FeeReceiptReply>
}
