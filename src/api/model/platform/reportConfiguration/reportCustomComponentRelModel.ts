import { Page } from '../../pageModel'

export interface ReportCustomComponentRelReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  componentId?: string
  customId?: string
  seq?: number
  statusCd?: string
  reportCustomComponent?: string
}

export interface ReportCustomComponentRelParams {
  id?: string
  componentId?: string
  customId?: string
  seq?: number
  statusCd?: string
}

export interface FindReportCustomComponentRelReply {
  page: Page
  list: Array<ReportCustomComponentRelReply>
}
