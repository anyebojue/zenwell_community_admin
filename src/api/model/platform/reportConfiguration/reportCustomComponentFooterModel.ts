import { Page } from '../../pageModel'

export interface ReportCustomComponentFooterReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  componentId?: string
  name?: string
  queryModel?: string
  goScript?: string
  componentSql?: string
  remark?: string
  statusCd?: string
}

export interface ReportCustomComponentFooterParams {
  id?: string
  componentId?: string
  name?: string
  queryModel?: string
  goScript?: string
  componentSql?: string
  remark?: string
}

export interface FindReportCustomComponentFooterReply {
  page: Page
  list: Array<ReportCustomComponentFooterReply>
}
