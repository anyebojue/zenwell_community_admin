import { Page } from '../../pageModel'

export interface FeeCollectionDetailReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  orderId?: string
  collectionName?: string
  ownerId?: string
  ownerName?: string
  feeName?: string
  payerObjId?: string
  payerObjName?: string
  payerObjType?: string
  communityId?: string
  collectionWay?: string
  stateCd?: string
  remarks?: string
  statusCd?: string
  oweAmount?: number
}

export interface FeeCollectionDetailParams {
  id?: string
  orderId?: string
  collectionName?: string
  ownerId?: string
  ownerName?: string
  feeName?: string
  payerObjId?: string
  payerObjName?: string
  payerObjType?: string
  communityId?: string
  collectionWay?: string
  stateCd?: string
  remarks?: string
  statusCd?: string
  oweAmount?: number
  StaffName?: string
}

export interface FindFeeCollectionDetailReply {
  page: Page
  list: Array<FeeCollectionDetailReply>
}
