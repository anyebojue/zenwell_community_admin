import { Page } from '../../pageModel'

export interface QueryReportFeeSummaryReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  curOweFee?: string
  curReceivableFee?: string
  feeRoomCount?: string
  hisOweFee?: string
  hisReceivedFee?: string
  oweRoomCount?: string
  preReceivedFee?: string
  receivedFee?: string
  roomCount?: string
}

export interface QueryReportFeeSummaryParams {
  startDate?: string
  endDate?: string
  floorId?: string
  objName?: string
  configId?: string
  feeTypeCd?: string
  ownerName?: string
  link?: string
  communityId?: string
  isExport?: boolean
  config_ids?: string[]
}

export interface FindQueryReportFeeSummaryReply {
  page: Page
  list: Array<QueryReportFeeSummaryReply>
  exportUrl: string
}
