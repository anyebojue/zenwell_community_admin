import { Page } from '../../pageModel'

export interface QueryDataReportFeeStatisticsReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  curMonthOweFee?: string
  curReceivableFee?: string
  feeRoomCount?: string
  floorNum?: string
  hisMonthOweFee?: string
  hisOweReceivedRoomAmount?: string
  hisOweReceivedRoomCount?: string
  monthReceivedRoomAmount?: string
  monthReceivedRoomCount?: string
  oweFee?: string
  oweRoomCount?: string
  roomCount?: string
  todayReceivedRoomAmount?: string
  todayReceivedRoomCount?: string
}

export interface QueryDataReportFeeStatisticsParams {
  id?: string
  startDate?: string
  endDate?: string
  communityId?: string
  isExport?: boolean
  feeTypeCd?: string
  floorIds?: string[]
}

export interface FindQueryDataReportFeeStatisticsReply {
  page: Page
  list: Array<QueryDataReportFeeStatisticsReply>
  exportUrl: string
}
