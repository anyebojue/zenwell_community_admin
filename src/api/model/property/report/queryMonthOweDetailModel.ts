import { Page } from '../../pageModel'

export interface QueryMonthOweDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
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

export interface QueryMonthOweDetailParams {
  id?: string
  communityId?: string
  isExport?: boolean
  feeStartDate?: string
  feeEndDate?: string
  feeTypeCd?: string
  floorId?: string
}

export interface FindQueryMonthOweDetailReply {
  page: Page
  list: Array<QueryMonthOweDetailReply>
  exportUrl: string
}
