import { Page } from '../../pageModel'

export interface ReportCustomComponentConditionReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  componentId?: string
  name?: string
  holdpace?: string
  param?: string
  type?: string
  remark?: string
  statusCd?: string
  seq?: number
}

export interface ReportCustomComponentConditionParams {
  id?: string
  componentId?: string
  name?: string
  holdpace?: string
  param?: string
  type?: string
}

export interface FindReportCustomComponentConditionReply {
  page: Page
  list: Array<ReportCustomComponentConditionReply>
}
