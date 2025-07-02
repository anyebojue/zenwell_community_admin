import { Page } from '../../pageModel'

export interface QueryReportFeeDetailCarReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  carId?: string
  carNum?: string
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

export interface QueryReportFeeDetailCarParams {
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

export interface FindQueryReportFeeDetailCarReply {
  page: Page
  list: Array<QueryReportFeeDetailCarReply>
  exportUrl: string
}
