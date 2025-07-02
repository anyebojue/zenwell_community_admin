import { Page } from '../../pageModel'
import { ReportFeeYearCollectionDetailReply } from './reportFeeYearCollectionDetailModel'

export interface ReportFeeYearCollectionReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  objType?: string
  objId?: string
  objName?: string
  builtUpArea?: number
  ownerName?: string
  ownerLink?: string
  ownerId?: string
  feeId?: string
  configId?: string
  feeName?: string
  communityId?: string
  statusCd?: string
  reportFeeYearCollectionDetail?: ReportFeeYearCollectionDetailReply
}

export interface ReportFeeYearCollectionParams {
  id?: string
  communityId?: string
  configId?: string
  objName?: string
  isExport?: boolean
  objType?: string
  feeTypeCd?: string
}

export interface FindReportFeeYearCollectionReply {
  page: Page
  list: Array<ReportFeeYearCollectionReply>
  exportUrl: string
}
