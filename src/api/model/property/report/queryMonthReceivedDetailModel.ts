import { Page } from '../../pageModel'

export interface QueryMonthReceivedDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  cashierName?: string
  createTime?: string
  curYearMonth?: string
  endTime?: string
  feeName?: string
  link?: string
  objName?: string
  ownerName?: string
  payOrderId?: string
  receivableAmount?: string
  receivedAmount?: string
  startTime?: string
}

export interface QueryMonthReceivedDetailParams {
  id?: string
  communityId?: string
  isExport?: boolean
  feeStartDate?: string
  feeEndDate?: string
  feeTypeCd?: string
  floorId?: string
}

export interface FindQueryMonthReceivedDetailReply {
  page: Page
  list: Array<QueryMonthReceivedDetailReply>
  exportUrl: string
}
