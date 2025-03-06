import { Page } from '../../pageModel'

export interface QueryOthersDataReportReply {
  name: string
  value: string
}

export interface QueryOthersDataReportParams {
  startDate: string
  endDate: string
  communityId: string
}

export interface FindQueryOthersDataReportReply {
  page: Page
  list: Array<QueryOthersDataReportReply>
}
