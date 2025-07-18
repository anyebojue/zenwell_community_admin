import { Page } from '../../pageModel'
import { ParkingSpaceInfoReply } from './parkingSpaceInfoModel'

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
  parkingBox?: string
  memberCount?: string
  parkingSpace?: ParkingSpaceInfoReply
  iotRemark?: string
  iotStateName?: string
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
  ownerName?: string
  carId?: string
  iotRemark?: string
  iotStateName?: string
  isExport?: boolean
}

export interface FindOwnerCarReply {
  page: Page
  list: Array<OwnerCarReply>
  exportUrl: string
}
