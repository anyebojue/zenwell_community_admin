import { Page } from '../../pageModel'

export interface OwnerCarReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  ownerId?: string
  carNum?: string
  carBrand?: string
  carType?: string
  carColor?: string
  psId?: string
  userId?: string
  remark?: string
  statusCd?: string
  communityId?: string
  startTime?: string
  endTime?: string
  stateCd?: string
  carTypeCd?: string
  memberId?: string
  leaseType?: string
  roomName?: string
  ownerName?: string
}

export interface OwnerCarParams {
  id?: string
  ownerId?: string
  carNum?: string
  carBrand?: string
  carType?: string
  carColor?: string
  psId?: string
  userId?: string
  remark?: string
  statusCd?: string
  communityId?: string
  startTime?: string
  endTime?: string
  stateCd?: string
  carTypeCd?: string
  memberId?: string
  leaseType?: string
}

export interface FindOwnerCarReply {
  page: Page
  list: Array<OwnerCarReply>
}
