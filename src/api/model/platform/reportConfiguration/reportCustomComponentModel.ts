import { Page } from '../../pageModel'

export interface ReportCustomComponentReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
  componentGroup?: string
  componentType?: string
  queryModel?: string
  goScript?: string
  remark?: string
  statusCd?: string
  componentSql?: string
}

export interface ReportCustomComponentParams {
  id?: string
  name?: string
  componentGroup?: string
  componentType?: string
  queryModel?: string
  goScript?: string
  remark?: string
  statusCd?: string
  componentSql?: string
}

export interface FindReportCustomComponentReply {
  page: Page
  list: Array<ReportCustomComponentReply>
}
