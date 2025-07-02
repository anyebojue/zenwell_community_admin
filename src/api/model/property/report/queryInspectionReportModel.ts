import { Page } from '../../pageModel'

export interface QueryInspectionReportReply {
  td: {
    list: {
      key: string
      name: string
      val: string
    }[]
  }[]
  th: {
    key: string
    name: string
  }[]
}

export interface QueryInspectionReportParams {
  communityId?: string
  isExport?: boolean
  startTime?: string
  endTime?: string
  componentType?: string
}

export interface FindQueryInspectionReportReply {
  page: Page
  list: Array<QueryInspectionReportReply>
  exportUrl: string
}
