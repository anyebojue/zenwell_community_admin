import { Page } from '../../pageModel'

export interface ReportCustomGroupReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
  url?: string
  remark?: string
  statusCd?: string
  reportCustoms?: []
}

export interface ReportCustomGroupParams {
  id?: string
  name?: string
  url?: string
}

export interface FindReportCustomGroupReply {
  page: Page
  list: Array<ReportCustomGroupReply>
}
