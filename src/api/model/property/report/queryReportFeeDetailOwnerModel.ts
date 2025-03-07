import { Page } from '../../pageModel'

export interface QueryReportFeeDetailOwnerReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  link?: string
  oweFee?: string
  ownerId?: string
  ownerName?: string
  receivedFee?: string
  receivedOweFees?: Array<{
    name: string
    oweFee: string
    receivedFee: string
  }>
}

export interface QueryReportFeeDetailOwnerParams {
  id?: string
  floorId?: string
  objName?: string
  startDate?: string
  endDate?: string
  configId?: string
  feeTypeCd?: string
  ownerName?: string
  link?: string
  communityId?: string
  isExport?: boolean
}

export interface FindQueryReportFeeDetailOwnerReply {
  page: Page
  list: Array<QueryReportFeeDetailOwnerReply>
  exportUrl: string
}
