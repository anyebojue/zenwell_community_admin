import { Page } from '../../pageModel'

export interface QueryInoutDataReportReply {
  name: string
  value: string
}

export interface QueryInoutDataReportParams {
  startDate: string
  endDate: string
  communityId: string
}

export interface FindQueryInoutDataReportReply {
  page: Page
  list: Array<QueryInoutDataReportReply>
}
