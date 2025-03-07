import { Page } from '../../pageModel'

export interface QueryOweStatisticsReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  feeRoomCount?: string
  feeTypeCd?: string
  floorId?: string
  floorName?: string
  floorNum?: string
  oweFee?: string
  oweFees?: Array<{
    key?: string
    val?: string
  }>
  oweRoomCount?: string
  roomCount?: string
}

export interface QueryOweStatisticsParams {
  id?: string
  startDate?: string
  endDate?: string
  communityId?: string
  isExport?: boolean
}

export interface FindQueryOweStatisticsReply {
  page: Page
  list: Array<QueryOweStatisticsReply>
  exportUrl: string
}
