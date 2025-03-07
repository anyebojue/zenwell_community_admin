import { Page } from '../../pageModel'

export interface QueryReportFeeDetailRoomReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  link?: string
  oweFee?: string
  ownerId?: string
  ownerName?: string
  receivedFee?: string
  roomId?: string
  roomName?: string
  receivedOweFees?: Array<{
    name: string
    oweFee: string
    receivedFee: string
  }>
}

export interface QueryReportFeeDetailRoomParams {
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

export interface FindQueryReportFeeDetailRoomReply {
  page: Page
  list: Array<QueryReportFeeDetailRoomReply>
  exportUrl: string
}
