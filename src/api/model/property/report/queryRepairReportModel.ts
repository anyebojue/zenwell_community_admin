import { Page } from '../../pageModel'

export interface QueryRepairReportReply {
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

export interface QueryRepairReportParams {
  communityId?: string
  isExport?: boolean
  startTime?: string
  endTime?: string
  componentType?: string
}

export interface FindQueryRepairReportReply {
  page: Page
  list: Array<QueryRepairReportReply>
  exportUrl: string
}
