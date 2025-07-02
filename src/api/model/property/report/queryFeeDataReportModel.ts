import { Page } from '../../pageModel'

export interface QueryFeeDataReportReply {
  name: string
  value: string
}

export interface QueryFeeDataReportParams {
  startDate: string
  endDate: string
  communityId: string
}

export interface FindQueryFeeDataReportReply {
  page: Page
  list: Array<QueryFeeDataReportReply>
}
