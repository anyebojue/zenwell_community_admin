import { Page } from '../../pageModel'

export interface ReportFeeYearCollectionDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  collectionId?: string
  collectionYear?: number
  receivableAmount?: number
  receivedAmount?: number
  communityId?: string
  statusCd?: string
  relationYear?: number
}

export interface ReportFeeYearCollectionDetailParams {
  id?: string
  collectionId?: string
  collectionYear?: number
  receivableAmount?: number
  receivedAmount?: number
  communityId?: string
  statusCd?: string
  relationYear?: number
}

export interface FindReportFeeYearCollectionDetailReply {
  page: Page
  list: Array<ReportFeeYearCollectionDetailReply>
}
