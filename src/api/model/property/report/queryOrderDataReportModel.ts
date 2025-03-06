import { Page } from '../../pageModel'

export interface QueryOrderDataReportReply {
  name: string
  value: string
}

export interface QueryOrderDataReportParams {
  startDate: string
  endDate: string
  communityId: string
}

export interface FindQueryOrderDataReportReply {
  page: Page
  list: Array<QueryOrderDataReportReply>
}
