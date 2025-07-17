import { Page } from '../../pageModel'
import { FeeCollectionDetailReply } from './feeCollectionDetailModel'

export interface FeeCollectionOrderReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
  staffId?: string
  staffName?: string
  communityId?: string
  collectionWay?: string
  stateCd?: string
  remark?: string
  statusCd?: string
  feeCollectionDetail?: FeeCollectionDetailReply
}

export interface FeeCollectionOrderParams {
  id?: string
  name?: string
  staffId?: string
  staffName?: string
  communityId?: string
  collectionWay?: string
  stateCd?: string
  remark?: string
  statusCd?: string
}

export interface FindFeeCollectionOrderReply {
  page: Page
  list: Array<FeeCollectionOrderReply>
}
