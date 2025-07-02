import { Page } from '../../pageModel'
import { PayFeeReply } from './payFeeModel'

export interface FeeReceiptDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
  receiptId?: string
  feeId?: string
  feeName?: string
  area?: string
  startTime?: string
  endTime?: string
  amount?: number
  cycle?: number
  communityId?: string
  statusCd?: string
  remark?: string
  squarePrice?: string
  payFee?: PayFeeReply
}

export interface FeeReceiptDetailParams {
  id?: string
  name?: string
  receiptId?: string
  feeId?: string
  feeName?: string
  area?: string
  startTime?: string
  endTime?: string
  amount?: number
  cycle?: number
  communityId?: string
  statusCd?: string
  remark?: string
  squarePrice?: string
  payFee?: null
}

export interface FindFeeReceiptDetailReply {
  page: Page
  list: Array<FeeReceiptDetailReply>
}
