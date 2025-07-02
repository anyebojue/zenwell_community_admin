import { Page } from '../../pageModel'

export interface ReportCustomReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  groupId?: string
  title?: string
  seq?: number
  remark?: string
  statusCd?: string
}

export interface ReportCustomParams {
  id?: string
  groupId?: string
  title?: string
}

export interface FindReportCustomReply {
  page: Page
  list: Array<ReportCustomReply>
}
