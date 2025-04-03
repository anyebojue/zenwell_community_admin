import { Page } from '../../pageModel'
import { ParkingSpaceInfoReply } from './parkingSpaceInfoModel'

export interface ParkingSpaceApplyReply {
  id?: string
  createdAt?: string
  updatedAt?: string
  name?: string
  psId?: string
  communityId?: string
  carNum?: string
  carBrand?: string
  carType?: string
  carColor?: string
  startTime?: string
  endTime?: string
  stateCd?: string
  configId?: string
  applyPersonName?: string
  applyPersonLink?: string
  applyPersonId?: string
  remark?: string
  statusCd?: string
  feeId?: string
  parkingSpace: ParkingSpaceInfoReply
}

export interface ParkingSpaceApplyParams {
  id?: string
  communityId?: string
  carNum?: string
  carBrand?: string
  carType?: string
  applyPersonId?: string
  applyPersonName?: string
  applyPersonLink?: string
  carColor?: string
  startTime?: string
  endTime?: string
  remark?: string
}

export interface FindParkingSpaceApplyReply {
  page: Page
  list: Array<ParkingSpaceApplyReply>
}
