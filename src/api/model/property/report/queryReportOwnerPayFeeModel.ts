import { Page } from '../../pageModel'

export interface ReportOwnerPayFeeDtos {
  id?: string
  createdAt?: string
  updatedAt?: string
  pfYear?: number
  pfMonth?: number
  pfDate?: string
  communityId?: string
  ownerId?: string
  ownerName?: string
  objName?: string
  objType?: string
  objId?: string
  detailId?: string
  configId?: string
  configName?: string
  feeId?: string
  feeName?: string
  amount?: string
  statusCd?: string
}

export interface QueryReportOwnerPayFeeReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  communityId?: string
  configId?: string
  feeId?: string
  feeName?: string
  objName?: string
  ownerId?: string
  ownerName?: string
  page?: number
  payerObjType?: string
  records?: number
  roomName?: string
  row?: number
  statusCd?: string
  total?: number
  reportOwnerPayFeeDtos?: Array<ReportOwnerPayFeeDtos>
}

export interface QueryReportOwnerPayFeeParams {
  id?: string
  communityId?: string
  isExport?: boolean
  feeTypeCd?: string
  configId?: string
  roomName?: string
  ownerName?: string
  pfYear?: string
}

export interface FindQueryReportOwnerPayFeeReply {
  page: Page
  list: Array<QueryReportOwnerPayFeeReply>
}
