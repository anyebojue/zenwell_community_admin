import { Page } from '../../pageModel'

export interface QueryReceivedDetailStatisticsReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  link?: string
  ownerId?: string
  ownerName?: string
  receivedFee?: string
  floorNum?: string
  roomId?: string
  receivedFees?: Array<{
    endTime?: string
    feeName?: string
    feeTypeCd?: string
    payerObjId?: string
    receivedAmount?: string
    startTime?: string
  }>
  roomName?: string
}

export interface QueryReceivedDetailStatisticsParams {
  id?: string
  startDate?: string
  endDate?: string
  communityId?: string
  isExport?: boolean
  objName?: string
  ownerName?: string
  link?: string
}

export interface FindQueryReceivedDetailStatisticsReply {
  page: Page
  list: Array<QueryReceivedDetailStatisticsReply>
  exportUrl: string
}
