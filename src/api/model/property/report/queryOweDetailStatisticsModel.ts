import { Page } from '../../pageModel'

export interface QueryOweDetailStatisticsReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  link?: string
  ownerId?: string
  ownerName?: string
  oweFee?: string
  oweFees?: Array<{
    amountOwed?: string
    deadlineTime?: string
    endTime?: string
    feeName?: string
    feeTypeCd?: string
    payerObjId?: string
  }>
  roomId?: string
  roomName?: string
}

export interface QueryOweDetailStatisticsParams {
  id?: string
  startDate?: string
  endDate?: string
  communityId?: string
  isExport?: boolean
  objName?: string
  ownerName?: string
  link?: string
}

export interface FindQueryOweDetailStatisticsReply {
  page: Page
  list: Array<QueryOweDetailStatisticsReply>
  exportUrl: string
}
