import { Page } from '../../pageModel'

export interface QueryReportFeeDetailContractReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  contractId?: string
  contractName?: string
  link?: string
  ownerId?: string
  ownerName?: string
  receivedOweFees?: Array<{
    name: string
    oweFee: string
    receivedFee: string
  }>
}

export interface QueryReportFeeDetailContractParams {
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

export interface FindQueryReportFeeDetailContractReply {
  page: Page
  list: Array<QueryReportFeeDetailContractReply>
  exportUrl: string
}
