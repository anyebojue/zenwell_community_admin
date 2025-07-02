import { Page } from '../../pageModel'

export interface QueryReceivedReportReply {
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

export interface QueryReceivedReportParams {
  communityId?: string
  isExport?: boolean
  startTime?: string
  endTime?: string
  componentType?: string
}

export interface FindQueryReceivedReportReply {
  page: Page
  list: Array<QueryReceivedReportReply>
  exportUrl: string
}
