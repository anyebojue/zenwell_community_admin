import { Page } from '../../pageModel'

export interface QueryReceivedWayStatisticsReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
  primeRate?: string
  receivedAmount?: string
}

export interface QueryReceivedWayStatisticsParams {
  id?: string
  startDate?: string
  endDate?: string
  communityId?: string
  isExport?: boolean
}

export interface FindQueryReceivedWayStatisticsReply {
  page: Page
  list: Array<QueryReceivedWayStatisticsReply>
  exportUrl: string
}
