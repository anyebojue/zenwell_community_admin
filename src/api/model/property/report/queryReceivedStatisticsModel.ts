import { Page } from '../../pageModel'

export interface QueryReceivedStatisticsReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  feeRoomCount?: string
  feeTypeCd?: string
  floorId?: string
  floorName?: string
  floorNum?: string
  receivedFee?: string
  receivedFees?: Array<{
    key?: string
    val?: string
  }>
  roomCount?: string
}

export interface QueryReceivedStatisticsParams {
  id?: string
  startDate?: string
  endDate?: string
  communityId?: string
  isExport?: boolean
}

export interface FindQueryReceivedStatisticsReply {
  page: Page
  list: Array<QueryReceivedStatisticsReply>
  exportUrl: string
}
